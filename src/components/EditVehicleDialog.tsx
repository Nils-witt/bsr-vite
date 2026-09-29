import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from '@mui/material';
import { Vehicle, type VehicleLogEntry } from '../data/Vehicle';
import { useAppDispatch } from '../store/hooks';
import { updateVehicle } from '../store/vehicleSlice';

interface Props {
  vehicle: Vehicle | null;
  onClose: () => void;
}

const toForm = (v: Vehicle) => ({
  name: v.name,
  plate: v.plate,
  typ: v.typ,
  fuehrer: String(v.personnel.fuehrer),
  unterfuehrer: String(v.personnel.unterfuehrer),
  helfer: String(v.personnel.helfer),
});

function EditVehicleDialog({ vehicle, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(vehicle ? toForm(vehicle) : null);
  const [prevVehicle, setPrevVehicle] = useState(vehicle);

  // Reset the form when a different vehicle is passed in (adjusting state during render)
  if (vehicle !== prevVehicle) {
    setPrevVehicle(vehicle);
    if (vehicle) setForm(toForm(vehicle));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => prev && { ...prev, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicle || !form) return;

    const fuehrer = Number(form.fuehrer);
    const unterfuehrer = Number(form.unterfuehrer);
    const helfer = Number(form.helfer);
    const now = new Date().toISOString();

    const changes: string[] = [];
    if (form.name !== vehicle.name) changes.push(`name: ${vehicle.name} → ${form.name}`);
    if (form.plate !== vehicle.plate) changes.push(`plate: ${vehicle.plate} → ${form.plate}`);
    if (form.typ !== vehicle.typ) changes.push(`type: ${vehicle.typ} → ${form.typ}`);
    if (fuehrer !== vehicle.personnel.fuehrer)
      changes.push(`Führer: ${vehicle.personnel.fuehrer} → ${fuehrer}`);
    if (unterfuehrer !== vehicle.personnel.unterfuehrer)
      changes.push(`Unterführer: ${vehicle.personnel.unterfuehrer} → ${unterfuehrer}`);
    if (helfer !== vehicle.personnel.helfer)
      changes.push(`Helfer: ${vehicle.personnel.helfer} → ${helfer}`);

    const logEntry: VehicleLogEntry = {
      timestamp: now,
      type: 'edited',
      description: changes.length > 0 ? changes.join(', ') : 'Saved without changes',
    };

    const updated = new Vehicle(
      vehicle.id,
      form.name,
      form.plate,
      form.typ,
      { fuehrer, unterfuehrer, helfer, sum: fuehrer + unterfuehrer + helfer },
      vehicle.createdAt,
      now,
      vehicle.arrivedAt,
      vehicle.assignedAt,
      vehicle.dispatchedAt,
      [...(vehicle.log ?? []), logEntry],
    );
    updated.state = vehicle.state;
    updated.preregisteredAt = vehicle.preregisteredAt;

    dispatch(updateVehicle(updated));
    onClose();
  }

  return (
    <Dialog open={!!vehicle} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Vehicle</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}
        >
          <TextField
            label="Name"
            name="name"
            value={form?.name ?? ''}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Plate"
            name="plate"
            value={form?.plate ?? ''}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Type"
            name="typ"
            value={form?.typ ?? ''}
            onChange={handleChange}
            required
            fullWidth
          />

          <Divider>Personnel</Divider>

          <TextField
            label="Führer"
            name="fuehrer"
            type="number"
            value={form?.fuehrer ?? ''}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Unterführer"
            name="unterfuehrer"
            type="number"
            value={form?.unterfuehrer ?? ''}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Helfer"
            name="helfer"
            type="number"
            value={form?.helfer ?? ''}
            onChange={handleChange}
            required
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditVehicleDialog;
