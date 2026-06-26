import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import type { Vehicle, VehicleLogEntry } from '../data/Vehicle';

interface Props {
  vehicle: Vehicle | null;
  onClose: () => void;
}

const TYPE_LABEL: Record<VehicleLogEntry['type'], string> = {
  created: 'Created',
  state_change: 'State',
  edited: 'Edited',
};

const TYPE_COLOR: Record<
  VehicleLogEntry['type'],
  'success' | 'info' | 'warning'
> = {
  created: 'success',
  state_change: 'info',
  edited: 'warning',
};

function VehicleLogDialog({ vehicle, onClose }: Props) {
  const log = vehicle?.log ?? [];

  return (
    <Dialog open={!!vehicle} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Change Log — {vehicle?.name}</DialogTitle>
      <DialogContent>
        {log.length === 0 ? (
          <Typography color="text.secondary">No log entries yet.</Typography>
        ) : (
          <List dense disablePadding>
            {[...log].reverse().map((entry, i) => (
              <ListItem key={i} alignItems="flex-start" disableGutters sx={{ gap: 1 }}>
                <Chip
                  label={TYPE_LABEL[entry.type]}
                  color={TYPE_COLOR[entry.type]}
                  size="small"
                  sx={{ mt: 0.5, minWidth: 72 }}
                />
                <ListItemText
                  primary={entry.description}
                  secondary={new Date(entry.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default VehicleLogDialog;
