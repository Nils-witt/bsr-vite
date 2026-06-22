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

  get peerId() {
    return this.peer?.id ?? null;
  }

  get connectedCount() {
    return this.connections.length;
  }

  /** Start as host — returns the generated peer ID */
  startHost(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer();

      this.peer.on('open', (id) => {
        this.isHost = true;
        this.peer!.on('connection', (conn) => this.handleIncoming(conn));
        // Broadcast on every store change
        this.unsubscribe = store.subscribe(() => this.broadcast());
        resolve(id);
      });

      this.peer.on('error', reject);
    });
  }

  /** Connect to an existing host */
  connectToHost(hostId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.peer = new Peer();

      this.peer.on('open', () => {
        const conn = this.peer!.connect(hostId);

        conn.on('open', () => {
          this.connections.push(conn);
          conn.on('data', (data) => this.handleData(data as SyncMessage));
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
      // Send current state immediately on connect
      this.sendTo(conn, store.getState().vehicles.vehicles);
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
      store.dispatch(setAllVehicles(msg.vehicles));
    }
  }
}

export const webrtcSync = new WebRTCSync();
