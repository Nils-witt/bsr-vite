import { useState } from 'react';
import {
  Autocomplete,
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
import { addVehicle } from '../store/vehicleSlice';

const VEHICLE_TYPE_PRESETS = [
  'HLF 20',
  'HLF 10',
  'LF 20',
  'LF 10',
  'LF 8/6',
  'TLF 3000',
  'TLF 2000',
  'DLK 23/12',
  'RW',
  'GW-L2',
  'GW-Mess',
  'ELW 1',
  'ELW 2',
  'MTF',
  'KTW',
  'RTW',
  'NEF',
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const defaultForm = {
  name: '',
  plate: '',
  typ: '',
  fuehrer: '',
  unterfuehrer: '',
  helfer: '',
};

function CreateVehicleDialog({ open, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(defaultForm);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const fuehrer = Number(form.fuehrer);
    const unterfuehrer = Number(form.unterfuehrer);
    const helfer = Number(form.helfer);

    const now = new Date().toISOString();
    const initialLog: VehicleLogEntry[] = [
      { timestamp: now, type: 'created', description: 'Vehicle created' },
    ];
    dispatch(
      addVehicle(
        new Vehicle(
          crypto.randomUUID(),
          form.name,
          form.plate,
          form.typ,
          { fuehrer, unterfuehrer, helfer, sum: fuehrer + unterfuehrer + helfer },
          now,
          now,
          undefined,
          undefined,
          undefined,
          initialLog,
        ),
      ),
    );

    setForm(defaultForm);
    onClose();
  }

  function handleClose() {
    setForm(defaultForm);
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>New Vehicle</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}
        >
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Plate"
            name="plate"
            value={form.plate}
            onChange={handleChange}
            required
            fullWidth
          />
          <Autocomplete
            freeSolo
            options={VEHICLE_TYPE_PRESETS}
            value={form.typ}
            onInputChange={(_, value) => setForm((prev) => ({ ...prev, typ: value }))}
            renderInput={(params) => (
              <TextField {...params} label="Type" name="typ" required fullWidth />
            )}
          />

          <Divider>Personnel</Divider>

          <TextField
            label="Führer"
            name="fuehrer"
            type="number"
            value={form.fuehrer}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Unterführer"
            name="unterfuehrer"
            type="number"
            value={form.unterfuehrer}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Helfer"
            name="helfer"
            type="number"
            value={form.helfer}
            onChange={handleChange}
            required
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateVehicleDialog;
