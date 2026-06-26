import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateVehicle } from '../store/vehicleSlice';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SpeedDial,
  Stack,
  Typography,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Vehicle, type VehicleLogEntry, type VehicleState } from '../data/Vehicle';
import EditVehicleDialog from '../components/EditVehicleDialog';
import CreateVehicleDialog from '../components/CreateVehicleDialog';
import VehicleLogDialog from '../components/VehicleLogDialog';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';

function VehicleGrid() {
  const vehicles = useAppSelector((state) => state.vehicles.vehicles);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [creating, setCreating] = useState(false);
  const [logVehicle, setLogVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    console.log(vehicles);
  }, [vehicles]);
  return (
    <>
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap' }}>
        <VehicleColumn
          state="preregistered"
          vehicles={vehicles.filter((value) => value.state == 'preregistered')}
          onEdit={setEditing}
          onLog={setLogVehicle}
        />
        <VehicleColumn
          state="arrived"
          vehicles={vehicles.filter((value) => value.state == 'arrived')}
          onEdit={setEditing}
          onLog={setLogVehicle}
        />
        <VehicleColumn
          state="registered"
          vehicles={vehicles.filter((value) => value.state == 'registered')}
          onEdit={setEditing}
          onLog={setLogVehicle}
        />
        <VehicleColumn
          state="assigned"
          vehicles={vehicles.filter((value) => value.state == 'assigned')}
          onEdit={setEditing}
          onLog={setLogVehicle}
        />
        <VehicleColumn
          state="dispatched"
          vehicles={vehicles.filter((value) => value.state == 'dispatched')}
          onEdit={setEditing}
          onLog={setLogVehicle}
        />
      </Stack>

      <Box style={{ position: 'fixed', bottom: 32, right: 32 }}>
        <SpeedDial
          ariaLabel="SpeedDial playground example"
          icon={<SpeedDialIcon />}
          direction={'up'}
          onClick={() => setCreating(true)}
          open={false}
        />
      </Box>

      <CreateVehicleDialog open={creating} onClose={() => setCreating(false)} />
      <EditVehicleDialog vehicle={editing} onClose={() => setEditing(null)} />
      <VehicleLogDialog vehicle={logVehicle} onClose={() => setLogVehicle(null)} />
    </>
  );
}

function VehicleColumn({
  state,
  vehicles,
  onEdit,
  onLog,
}: {
  state: VehicleState;
  vehicles: Vehicle[];
  onEdit: (v: Vehicle) => void;
  onLog: (v: Vehicle) => void;
}) {
  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant={'h5'}>{state.toUpperCase()}</Typography>
      {vehicles.map((v) => (
        <VehicleCard key={v.id} vehicle={v} onEdit={onEdit} onLog={onLog} />
      ))}
    </Box>
  );
}

const ALL_STATES: VehicleState[] = [
  'preregistered',
  'arrived',
  'registered',
  'assigned',
  'dispatched',
];

const STATE_TIMESTAMP_KEY: Partial<Record<VehicleState, keyof Vehicle>> = {
  arrived: 'arrivedAt',
  assigned: 'assignedAt',
  dispatched: 'dispatchedAt',
};

function VehicleCard({
  vehicle,
  onEdit,
  onLog,
}: {
  vehicle: Vehicle;
  onEdit: (v: Vehicle) => void;
  onLog: (v: Vehicle) => void;
}) {
  const dispatch = useAppDispatch();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  function handleStateChange(newState: VehicleState) {
    const tsKey = STATE_TIMESTAMP_KEY[newState];
    const now = new Date().toISOString();
    const update: Partial<Vehicle> = { state: newState, updatedAt: now };
    if (tsKey) update[tsKey] = now as never;
    const logEntry: VehicleLogEntry = {
      timestamp: now,
      type: 'state_change',
      description: `State changed from ${vehicle.state} to ${newState}`,
    };
    dispatch(
      updateVehicle({ ...vehicle, ...update, log: [...(vehicle.log ?? []), logEntry] }),
    );
    setMenuAnchor(null);
  }

  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          {vehicle.typ} - {vehicle.plate}
        </Typography>
        <Typography variant="h5" component="div">
          {vehicle.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {vehicle.personnel.fuehrer} / {vehicle.personnel.unterfuehrer} /{' '}
          {vehicle.personnel.helfer} // {vehicle.personnel.sum}
        </Typography>
        <Stack direction={'column'}>
          {vehicle.preregisteredAt && (
            <Typography variant="caption" color="text.secondary">
              Preregistered: {new Date(vehicle.preregisteredAt).toLocaleTimeString()}
            </Typography>
          )}
          {vehicle.arrivedAt && (
            <Typography variant="caption" color="text.secondary">
              Arrived: {new Date(vehicle.arrivedAt).toLocaleTimeString()}
            </Typography>
          )}
          {vehicle.assignedAt && (
            <Typography variant="caption" color="text.secondary">
              Assigned: {new Date(vehicle.assignedAt).toLocaleTimeString()}
            </Typography>
          )}
          {vehicle.dispatchedAt && (
            <Typography variant="caption" color="text.secondary">
              Dispatched: {new Date(vehicle.dispatchedAt).toLocaleTimeString()}
            </Typography>
          )}
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onEdit(vehicle)}>
          Edit
        </Button>
        <Button size="small" onClick={() => onLog(vehicle)}>
          Log
        </Button>
        <Button
          size="small"
          startIcon={<SwapHorizIcon />}
          onClick={(e) => setMenuAnchor(e.currentTarget)}
        >
          {vehicle.state}
        </Button>
        <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
          {ALL_STATES.map((s) => (
            <MenuItem key={s} selected={s === vehicle.state} onClick={() => handleStateChange(s)}>
              {s === vehicle.state && (
                <ListItemIcon>
                  <CheckCircleIcon fontSize="small" />
                </ListItemIcon>
              )}
              <ListItemText inset={s !== vehicle.state}>{s}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </CardActions>
    </Card>
  );
}

export default VehicleGrid;
