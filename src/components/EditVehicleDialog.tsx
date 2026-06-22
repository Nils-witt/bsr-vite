import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from '@mui/material';
import { Vehicle } from '../data/Vehicle';
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

  useEffect(() => {
    if (vehicle) setForm(toForm(vehicle));
  }, [vehicle]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => prev && { ...prev, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicle || !form) return;

    const fuehrer = Number(form.fuehrer);
    const unterfuehrer = Number(form.unterfuehrer);
    const helfer = Number(form.helfer);

    const updated = new Vehicle(vehicle.id, form.name, form.plate, form.typ, {
      fuehrer,
      unterfuehrer,
      helfer,
      sum: fuehrer + unterfuehrer + helfer,
    });
    updated.state = vehicle.state;

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
            inputProps={{ min: 0 }}
            value={form?.fuehrer ?? ''}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Unterführer"
            name="unterfuehrer"
            type="number"
            inputProps={{ min: 0 }}
            value={form?.unterfuehrer ?? ''}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Helfer"
            name="helfer"
            type="number"
            inputProps={{ min: 0 }}
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
