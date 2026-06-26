import {
  Box,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector } from '../store/hooks';
import type { VehicleLogEntry } from '../data/Vehicle';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface GlobalLogEntry extends VehicleLogEntry {
  vehicleName: string;
  vehiclePlate: string;
}

const TYPE_LABEL: Record<VehicleLogEntry['type'], string> = {
  created: 'Created',
  state_change: 'State',
  edited: 'Edited',
};

const TYPE_COLOR: Record<VehicleLogEntry['type'], 'success' | 'info' | 'warning'> = {
  created: 'success',
  state_change: 'info',
  edited: 'warning',
};

function GlobalLogDrawer({ open, onClose }: Props) {
  const vehicles = useAppSelector((state) => state.vehicles.vehicles);

  const entries: GlobalLogEntry[] = vehicles
    .flatMap((v) =>
      (v.log ?? []).map((entry) => ({
        ...entry,
        vehicleName: v.name,
        vehiclePlate: v.plate,
      })),
    )
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 400 } }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">Global Log</Typography>
        <IconButton edge="end" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
      {entries.length === 0 ? (
        <Box sx={{ px: 2 }}>
          <Typography color="text.secondary">No log entries yet.</Typography>
        </Box>
      ) : (
        <List dense disablePadding>
          {entries.map((entry, i) => (
            <ListItem key={i} alignItems="flex-start" sx={{ gap: 1, px: 2 }}>
              <Chip
                label={TYPE_LABEL[entry.type]}
                color={TYPE_COLOR[entry.type]}
                size="small"
                sx={{ mt: 0.5, minWidth: 72, flexShrink: 0 }}
              />
              <ListItemText
                primary={
                  <Box component="span" sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                    <Typography component="span" variant="body2" fontWeight={600}>
                      {entry.vehicleName}
                    </Typography>
                    <Typography component="span" variant="caption" color="text.secondary">
                      {entry.vehiclePlate}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    {entry.description}
                    <br />
                    {new Date(entry.timestamp).toLocaleString()}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Drawer>
  );
}

export default GlobalLogDrawer;
