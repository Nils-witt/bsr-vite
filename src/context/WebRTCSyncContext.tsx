import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { webrtcSync, WebRTCSync } from '../services/webrtcSync';

type Status = 'idle' | 'connecting' | 'hosting' | 'connected' | 'error';

interface WebRTCSyncContextValue {
  status: Status;
  peerId: string | null;
  error: string | null;
  startHost: () => Promise<void>;
  connectToHost: (hostId: string) => Promise<void>;
  disconnect: () => void;
}

const WebRTCSyncContext = createContext<WebRTCSyncContextValue | null>(null);

export function WebRTCSyncProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('idle');
  const [peerId, setPeerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startHost = useCallback(async () => {
    setStatus('connecting');
    setError(null);
    try {
      const id = await webrtcSync.startHost();
      setPeerId(id);
      setStatus('hosting');
    } catch (e) {
      setError(String(e));
      setStatus('error');
    }
  }, []);

  const connectToHost = useCallback(async (hostId: string) => {
    setStatus('connecting');
    setError(null);
    try {
      await webrtcSync.connectToHost(hostId);
      setStatus('connected');
    } catch (e) {
      setError(String(e));
      setStatus('error');
    }
  }, []);

  const disconnect = useCallback(() => {
    webrtcSync.destroy();
    setStatus('idle');
    setPeerId(null);
    setError(null);
  }, []);

  // Auto-reconnect on mount
  useEffect(() => {
    const lastClientId = WebRTCSync.getLastHostId();

    if (lastClientId) {
      connectToHost(lastClientId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WebRTCSyncContext.Provider
      value={{ status, peerId, error, startHost, connectToHost, disconnect }}
    >
      {children}
    </WebRTCSyncContext.Provider>
  );
}

export function useWebRTCSync() {
  const ctx = useContext(WebRTCSyncContext);
  if (!ctx) throw new Error('useWebRTCSync must be used inside WebRTCSyncProvider');
  return ctx;
}
