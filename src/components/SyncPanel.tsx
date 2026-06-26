import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { QRCodeSVG } from 'qrcode.react';
import { useWebRTCSync } from '../context/WebRTCSyncContext';
import { WebRTCSync } from '../services/webrtcSync';
import QrScanner from './QrScanner';

function SyncPanel() {
  const { status, peerId, error, connectedPeers, startHost, connectToHost, disconnect } = useWebRTCSync();
  const [open, setOpen] = useState(false);
  const [hostId, setHostId] = useState(() => WebRTCSync.getLastHostId() ?? '');
  const [scanning, setScanning] = useState(false);

  const isActive = status === 'hosting' || status === 'connected';

  function handleScan(value: string) {
    setScanning(false);
    connectToHost(value);
  }

  return (
    <>
      <Tooltip title="Sync">
        <IconButton color="inherit" onClick={() => setOpen(true)}>
          {isActive ? <WifiIcon /> : <WifiOffIcon />}
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setScanning(false);
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Real-time Sync</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}
        >
          {status === 'idle' && !scanning && (
            <>
              <Button variant="contained" onClick={startHost}>
                Host a session
              </Button>
              <Typography variant="body2" align="center" color="text.secondary">
                — or join one —
              </Typography>
              <TextField
                label="Host ID"
                value={hostId}
                onChange={(e) => setHostId(e.target.value)}
                size="small"
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  disabled={!hostId.trim()}
                  onClick={() => connectToHost(hostId.trim())}
                  sx={{ flexGrow: 1 }}
                >
                  Connect
                </Button>
                <Tooltip title="Scan QR code">
                  <IconButton onClick={() => setScanning(true)}>
                    <QrCodeScannerIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}

          {status === 'idle' && scanning && (
            <>
              <Typography variant="body2">Point your camera at the host's QR code:</Typography>
              <QrScanner onScan={handleScan} />
              <Button onClick={() => setScanning(false)}>Cancel</Button>
            </>
          )}

          {status === 'connecting' && <Typography color="text.secondary">Connecting…</Typography>}

          {status === 'hosting' && peerId && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="Hosting" color="success" />
                <Typography variant="body2" color="text.secondary">
                  {connectedPeers.length} client{connectedPeers.length !== 1 ? 's' : ''} connected
                </Typography>
              </Box>
              <Typography variant="body2">Share this ID with others:</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <QRCodeSVG value={peerId} size={180} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ fontFamily: 'monospace', wordBreak: 'break-all', flexGrow: 1 }}
                >
                  {peerId}
                </Typography>
                <Tooltip title="Copy">
                  <IconButton size="small" onClick={() => navigator.clipboard.writeText(peerId)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              {connectedPeers.length > 0 && (
                <>
                  <Divider />
                  <Typography variant="body2" color="text.secondary">
                    Connected clients:
                  </Typography>
                  <List dense disablePadding>
                    {connectedPeers.map((peer) => (
                      <ListItem key={peer} disableGutters>
                        <ListItemText
                          primary={peer}
                          slotProps={{ primary: { sx: { fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' } } }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </>
          )}

          {status === 'connected' && (
            <Chip label="Connected" color="success" sx={{ alignSelf: 'flex-start' }} />
          )}

          {status === 'error' && <Typography color="error">{error ?? 'Unknown error'}</Typography>}
        </DialogContent>
        <DialogActions>
          {isActive && (
            <Button
              color="error"
              onClick={() => {
                disconnect();
                setOpen(false);
              }}
            >
              Disconnect
            </Button>
          )}
          <Button
            onClick={() => {
              setOpen(false);
              setScanning(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SyncPanel;
