import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateVehicle } from '../store/vehicleSlice';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  SpeedDial,
  Stack,
  Typography,
} from '@mui/material';
import { Vehicle, type VehicleState } from '../data/Vehicle';
import EditVehicleDialog from '../components/EditVehicleDialog';
import CreateVehicleDialog from '../components/CreateVehicleDialog';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';

function VehicleGrid() {
  const vehicles = useAppSelector((state) => state.vehicles.vehicles);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    console.log(vehicles);
  }, [vehicles]);
  return (
    <>
      <Stack direction="row">
        <VehicleColumn
          state="preregistered"
          vehicles={vehicles.filter((value) => value.state == 'preregistered')}
          onEdit={setEditing}
        />
        <VehicleColumn
          state="arrived"
          vehicles={vehicles.filter((value) => value.state == 'arrived')}
          onEdit={setEditing}
        />
        <VehicleColumn
          state="assigned"
          vehicles={vehicles.filter((value) => value.state == 'assigned')}
          onEdit={setEditing}
        />
        <VehicleColumn
          state="dispatched"
          vehicles={vehicles.filter((value) => value.state == 'dispatched')}
          onEdit={setEditing}
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
    </>
  );
}

function VehicleColumn({
  state,
  vehicles,
  onEdit,
}: {
  state: VehicleState;
  vehicles: Vehicle[];
  onEdit: (v: Vehicle) => void;
}) {
  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant={'h5'}>{state.toUpperCase()}</Typography>
      {vehicles.map((v) => (
        <VehicleCard key={v.id} vehicle={v} onEdit={onEdit} />
      ))}
    </Box>
  );
}

function VehicleCard({ vehicle, onEdit }: { vehicle: Vehicle; onEdit: (v: Vehicle) => void }) {
  const dispatch = useAppDispatch();

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
        {vehicle.state === 'preregistered' && (
          <Button
            size="small"
            onClick={() =>
              dispatch(
                updateVehicle({
                  ...vehicle,
                  state: 'arrived',
                  arrivedAt: new Date().toISOString(),
                }),
              )
            }
          >
            Arrived
          </Button>
        )}
        {vehicle.state === 'arrived' && (
          <Button
            size="small"
            onClick={() =>
              dispatch(
                updateVehicle({
                  ...vehicle,
                  state: 'assigned',
                  assignedAt: new Date().toISOString(),
                }),
              )
            }
          >
            Assigned
          </Button>
        )}
        {vehicle.state === 'assigned' && (
          <Button
            size="small"
            onClick={() =>
              dispatch(
                updateVehicle({
                  ...vehicle,
                  state: 'dispatched',
                  dispatchedAt: new Date().toISOString(),
                }),
              )
            }
          >
            Dispatched
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default VehicleGrid;
