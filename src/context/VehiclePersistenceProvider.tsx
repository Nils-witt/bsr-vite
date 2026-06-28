import { useEffect, useRef, useState } from 'react';
import { store } from '../store/store';
import { setAllVehicles } from '../store/vehicleSlice';
import { loadVehicles, saveVehicles } from '../services/vehicleDB';
import { TabSync } from '../services/tabSync';

interface Props {
  children: React.ReactNode;
}

function VehiclePersistenceProvider({ children }: Props) {
  const [ready, setReady] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const receivingBroadcast = useRef(false);

  useEffect(() => {
    TabSync.init();

    const unsubscribeTabSync = TabSync.onUpdate((vehicles) => {
      receivingBroadcast.current = true;
      store.dispatch(setAllVehicles(vehicles));
      receivingBroadcast.current = false;
    });

    loadVehicles().then((vehicles) => {
      if (vehicles.length > 0) {
        store.dispatch(setAllVehicles(vehicles));
      }
      setReady(true);
    });

    const unsubscribe = store.subscribe(() => {
      const vehicles = store.getState().vehicles.vehicles;

      if (!receivingBroadcast.current) {
        TabSync.broadcast(vehicles);
      }

      // Debounce writes so rapid dispatches only trigger one save
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        saveVehicles(vehicles);
      }, 300);
    });

    return () => {
      unsubscribeTabSync();
      unsubscribe();
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      TabSync.destroy();
    };
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}

export default VehiclePersistenceProvider;
