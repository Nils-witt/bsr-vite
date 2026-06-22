import { useState, useCallback } from 'react';
import { webrtcSync } from '../services/webrtcSync';

type Status = 'idle' | 'connecting' | 'hosting' | 'connected' | 'error';

export function useWebRTCSync() {
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

  return { status, peerId, error, startHost, connectToHost, disconnect };
}
