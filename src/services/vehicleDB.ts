import { openDB } from 'idb';
import type { DBSchema } from 'idb';
import { Vehicle } from '../data/Vehicle';

interface BSRSchema extends DBSchema {
  vehicles: {
    key: string;
    value: Vehicle;
  };
}

const DB_NAME = 'bsr';
const DB_VERSION = 1;

function getDB() {
  return openDB<BSRSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore('vehicles', { keyPath: 'id' });
    },
  });
}

export async function loadVehicles(): Promise<Vehicle[]> {
  const db = await getDB();
  return db.getAll('vehicles');
}

export async function saveVehicles(vehicles: Vehicle[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('vehicles', 'readwrite');
  const store = tx.objectStore('vehicles');

  const existingKeys = await store.getAllKeys();
  const incomingKeys = new Set(vehicles.map((v) => v.id));

  await Promise.all([
    ...existingKeys.filter((k) => !incomingKeys.has(k)).map((k) => store.delete(k)),
    ...vehicles.map((v) => store.put(v)),
    tx.done,
  ]);
}
