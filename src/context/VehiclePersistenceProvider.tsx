import { useEffect, useRef, useState } from 'react';
import { store } from '../store/store';
import { setAllVehicles } from '../store/vehicleSlice';
import { loadVehicles, saveVehicles } from '../services/vehicleDB';

interface Props {
  children: React.ReactNode;
}

function VehiclePersistenceProvider({ children }: Props) {
  const [ready, setReady] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadVehicles().then((vehicles) => {
      if (vehicles.length > 0) {
        store.dispatch(setAllVehicles(vehicles));
      }
      setReady(true);
    });

    const unsubscribe = store.subscribe(() => {
      // Debounce writes so rapid dispatches only trigger one save
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        saveVehicles(store.getState().vehicles.vehicles);
      }, 300);
    });

    return () => {
      unsubscribe();
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}

export default VehiclePersistenceProvider;
