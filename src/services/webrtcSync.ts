import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import { store } from '../store/store';
import { setAllVehicles } from '../store/vehicleSlice';
import { Vehicle } from '../data/Vehicle';

type SyncMessage = { type: 'STATE_SYNC'; vehicles: Vehicle[] };

class WebRTCSync {
  private peer: Peer | null = null;
  private connections: DataConnection[] = [];
  private isHost = false;
  private unsubscribe: (() => void) | null = null;
  // Prevents re-broadcasting updates that originated remotely
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
    const savedId = localStorage.getItem(WebRTCSync.STORAGE_KEY) ?? undefined;

    return new Promise((resolve, reject) => {
      this.peer = savedId ? new Peer(savedId) : new Peer();

      this.peer.on('open', (id) => {
        localStorage.setItem(WebRTCSync.STORAGE_KEY, id);
        this.isHost = true;
        this.peer!.on('connection', (conn) => this.handleIncoming(conn));
        this.unsubscribe = store.subscribe(() => {
          if (!this.applyingRemote) this.broadcast();
        });
        resolve(id);
      });

      this.peer.on('error', reject);
    });
  }

  connectToHost(hostId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer();

      this.peer.on('open', () => {
        const conn = this.peer!.connect(hostId);

        conn.on('open', () => {
          localStorage.setItem(WebRTCSync.LAST_HOST_KEY, hostId);
          this.connections.push(conn);
          conn.on('data', (data) => this.handleData(data as SyncMessage));
          // Subscribe and send local changes up to the host
          this.unsubscribe = store.subscribe(() => {
            if (!this.applyingRemote) this.sendTo(conn, store.getState().vehicles.vehicles);
          });
          resolve();
        });

        conn.on('error', reject);
      });

      this.peer.on('error', reject);
    });
  }

  destroy() {
    this.unsubscribe?.();
    this.peer?.destroy();
    this.peer = null;
    this.connections = [];
    this.isHost = false;
  }

  private handleIncoming(conn: DataConnection) {
    conn.on('open', () => {
      this.connections.push(conn);
      conn.on('close', () => {
        this.connections = this.connections.filter((c) => c !== conn);
      });
      // Send current state to the new client immediately
      this.sendTo(conn, store.getState().vehicles.vehicles);
      // Relay updates from this client to all other connections
      conn.on('data', (data) => {
        const msg = data as SyncMessage;
        this.applyRemote(msg.vehicles);
        this.connections
          .filter((c) => c !== conn)
          .forEach((c) => this.sendTo(c, msg.vehicles));
      });
    });
  }

  private broadcast() {
    const vehicles = store.getState().vehicles.vehicles;
    this.connections.forEach((conn) => this.sendTo(conn, vehicles));
  }

  private sendTo(conn: DataConnection, vehicles: Vehicle[]) {
    if (conn.open) {
      conn.send({ type: 'STATE_SYNC', vehicles } satisfies SyncMessage);
    }
  }

  private handleData(msg: SyncMessage) {
    if (msg.type === 'STATE_SYNC') {
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
export const webrtcSync = new WebRTCSync();
