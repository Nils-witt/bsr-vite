import { useCallback, useEffect, useState } from 'react';
import { WebRTCSync } from '../services/webrtcSync';
import { WebRTCSyncContext, type Status } from './useWebRTCSync';

export function WebRTCSyncProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>(() =>
    WebRTCSync.getLastHostId() ? 'connecting' : 'idle',
  );
  const [peerId, setPeerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);

  useEffect(() => {
    WebRTCSync.getInstance().setOnConnectionsChange(setConnectedPeers);
    return () => WebRTCSync.getInstance().setOnConnectionsChange(null);
  }, []);

  const startHost = useCallback(async () => {
    setStatus('connecting');
    setError(null);
    try {
      const id = await WebRTCSync.getInstance().startHost();
      setPeerId(id);
      setStatus('hosting');
    } catch (e) {
      setError(String(e));
      setStatus('error');
    }
  }, []);

  // setState only runs in promise callbacks, so this is safe to call from an effect
  const establishConnection = useCallback(
    (hostId: string) =>
      WebRTCSync.getInstance()
        .connectToHost(hostId)
        .then(
          () => setStatus('connected'),
          (e) => {
            setError(String(e));
            setStatus('error');
          },
        ),
    [],
  );

  const connectToHost = useCallback(
    async (hostId: string) => {
      setStatus('connecting');
      setError(null);
      await establishConnection(hostId);
    },
    [establishConnection],
  );

  const disconnect = useCallback(() => {
    WebRTCSync.getInstance().destroy();
    setStatus('idle');
    setPeerId(null);
    setError(null);
  }, []);

  // Auto-reconnect on mount; initial status is already 'connecting' in that case
  useEffect(() => {
    const lastHostId = WebRTCSync.getLastHostId();

    if (lastHostId) {
      establishConnection(lastHostId);
    }
  }, [establishConnection]);

  return (
    <WebRTCSyncContext.Provider
      value={{ status, peerId, error, connectedPeers, startHost, connectToHost, disconnect }}
    >
      {children}
    </WebRTCSyncContext.Provider>
  );
}
