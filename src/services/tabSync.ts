import type { Vehicle } from '../data/Vehicle';

const CHANNEL_NAME = 'bsr-tab-sync';

type TabSyncMessage = {
  type: 'vehicles_update';
  vehicles: Vehicle[];
};

type UpdateListener = (vehicles: Vehicle[]) => void;

export class TabSync {
  private static channel: BroadcastChannel | null = null;
  private static listeners: UpdateListener[] = [];

  static init() {
    if (this.channel) return;
    this.channel = new BroadcastChannel(CHANNEL_NAME);
    this.channel.onmessage = (event: MessageEvent<TabSyncMessage>) => {
      if (event.data.type === 'vehicles_update') {
        this.listeners.forEach((fn) => fn(event.data.vehicles));
      }
    };
  }

  static broadcast(vehicles: Vehicle[]) {
    this.channel?.postMessage({ type: 'vehicles_update', vehicles } satisfies TabSyncMessage);
  }

  static onUpdate(fn: UpdateListener): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  static destroy() {
    this.channel?.close();
    this.channel = null;
    this.listeners = [];
  }
}
