import { createContext, useContext } from 'react';

export type Status = 'idle' | 'connecting' | 'hosting' | 'connected' | 'error';

export interface WebRTCSyncContextValue {
  status: Status;
  peerId: string | null;
  error: string | null;
  connectedPeers: string[];
  startHost: () => Promise<void>;
  connectToHost: (hostId: string) => Promise<void>;
  disconnect: () => void;
}

export const WebRTCSyncContext = createContext<WebRTCSyncContextValue | null>(null);

export function useWebRTCSync() {
  const ctx = useContext(WebRTCSyncContext);
  if (!ctx) throw new Error('useWebRTCSync must be used inside WebRTCSyncProvider');
  return ctx;
}
