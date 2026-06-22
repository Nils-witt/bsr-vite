import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import { store } from '../store/store';
import { setAllVehicles } from '../store/vehicleSlice';
import { Vehicle } from '../data/Vehicle';

type SyncMessage = { type: 'STATE_SYNC'; vehicles: Vehicle[] };

const log = (...args: unknown[]) => console.log('[WebRTCSync]', ...args);
const warn = (...args: unknown[]) => console.warn('[WebRTCSync]', ...args);
const error = (...args: unknown[]) => console.error('[WebRTCSync]', ...args);

class WebRTCSync {
  private static instance: WebRTCSync | undefined;

  private constructor() {}

  public static getInstance(): WebRTCSync {
    if (!this.instance) {
      this.instance = new WebRTCSync();
    }
    return this.instance;
  }

  private peer: Peer | null = null;
  private connections: DataConnection[] = [];
  private isHost = false;
  private unsubscribe: (() => void) | null = null;
  private applyingRemote = false;

  get peerId() {
    return this.peer?.id ?? null;
  }

  get connectedCount() {
    return this.connections.length;
  }

  private static readonly STORAGE_KEY = 'bsr_host_peer_id';
  private static readonly LAST_HOST_KEY = 'bsr_last_host_id';

  static getLastHostId(): string | null {
    return localStorage.getItem(WebRTCSync.LAST_HOST_KEY);
  }

  startHost(): Promise<string> {
    if (this.peer) {
      warn('startHost called while a connection is already active — destroying existing connection');
      this.destroy();
    }

    const savedId = localStorage.getItem(WebRTCSync.STORAGE_KEY) ?? undefined;
    log(savedId ? `Starting host with saved ID: ${savedId}` : 'Starting host with new ID');

    return new Promise((resolve, reject) => {
      this.peer = savedId ? new Peer(savedId) : new Peer();

      this.peer.on('open', (id) => {
        log(`Host open, peer ID: ${id}`);
        localStorage.setItem(WebRTCSync.STORAGE_KEY, id);
        this.isHost = true;
        this.peer!.on('connection', (conn) => this.handleIncoming(conn));
        this.unsubscribe = store.subscribe(() => {
          if (!this.applyingRemote) this.broadcast();
        });
        resolve(id);
      });

      this.peer.on('error', (err) => {
        error('Peer error (host):', err);
        reject(err);
      });
    });
  }

  connectToHost(hostId: string): Promise<void> {
    if (this.peer) {
      warn('connectToHost called while a connection is already active — destroying existing connection');
      this.destroy();
    }

    log(`Connecting to host: ${hostId}`);

    return new Promise((resolve, reject) => {
      this.peer = new Peer();

      this.peer.on('open', (id) => {
        log(`Client peer open, own ID: ${id}`);
        const conn = this.peer!.connect(hostId);

        conn.on('open', () => {
          log(`Connection to host established: ${hostId}`);
          localStorage.setItem(WebRTCSync.LAST_HOST_KEY, hostId);
          this.connections.push(conn);
          conn.on('data', (data) => this.handleData(data as SyncMessage));
          this.unsubscribe = store.subscribe(() => {
            if (!this.applyingRemote) this.sendTo(conn, store.getState().vehicles.vehicles);
          });
          resolve();
        });

        conn.on('close', () => warn(`Connection to host closed: ${hostId}`));

        conn.on('error', (err) => {
          error('Connection error (client):', err);
          reject(err);
        });
      });

      this.peer.on('error', (err) => {
        error('Peer error (client):', err);
        reject(err);
      });
    });
  }

  destroy() {
    log('Destroying peer and all connections');
    this.unsubscribe?.();
    this.peer?.destroy();
    this.peer = null;
    this.connections = [];
    this.isHost = false;
  }

  private handleIncoming(conn: DataConnection) {
    log(`Incoming connection from: ${conn.peer}`);

    conn.on('open', () => {
      log(`Incoming connection open: ${conn.peer} (total: ${this.connections.length + 1})`);
      this.connections.push(conn);

      conn.on('close', () => {
        log(`Client disconnected: ${conn.peer} (total: ${this.connections.length - 1})`);
        this.connections = this.connections.filter((c) => c !== conn);
      });

      this.sendTo(conn, store.getState().vehicles.vehicles);

      conn.on('data', (data) => {
        const msg = data as SyncMessage;
        log(`Received state from client ${conn.peer} (${msg.vehicles.length} vehicles), relaying to ${this.connections.length - 1} peers`);
        this.applyRemote(msg.vehicles);
        this.connections.filter((c) => c !== conn).forEach((c) => this.sendTo(c, msg.vehicles));
      });
    });
  }

  private broadcast() {
    const vehicles = store.getState().vehicles.vehicles;
    log(`Broadcasting state to ${this.connections.length} client(s) (${vehicles.length} vehicles)`);
    this.connections.forEach((conn) => this.sendTo(conn, vehicles));
  }

  private sendTo(conn: DataConnection, vehicles: Vehicle[]) {
    if (conn.open) {
      conn.send({ type: 'STATE_SYNC', vehicles } satisfies SyncMessage);
    } else {
      warn(`Attempted to send to closed connection: ${conn.peer}`);
    }
  }

  private handleData(msg: SyncMessage) {
    if (msg.type === 'STATE_SYNC') {
      log(`Received state from host (${msg.vehicles.length} vehicles)`);
      this.applyRemote(msg.vehicles);
    }
  }

  private applyRemote(vehicles: Vehicle[]) {
    this.applyingRemote = true;
    store.dispatch(setAllVehicles(vehicles));
    this.applyingRemote = false;
  }
}

export { WebRTCSync };
