import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import type { Vehicle } from '../data/Vehicle.ts';

function Home() {
  const vehicles = useAppSelector((state) => state.vehicles.vehicles);

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Vehicles</Typography>
        <Button variant="contained" component={Link} to="/vehicles/create">
          New Vehicle
        </Button>
      </Stack>

      {vehicles.length === 0 ? (
        <Typography color="text.secondary">No vehicles yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Plate</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="center">Führer</TableCell>
                <TableCell align="center">Unterführer</TableCell>
                <TableCell align="center">Helfer</TableCell>
                <TableCell align="center">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((v: Vehicle) => (
                <TableRow key={v.id} hover>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.plate}</TableCell>
                  <TableCell>
                    <Chip label={v.typ} size="small" />
                  </TableCell>
                  <TableCell align="center">{v.personnel.fuehrer}</TableCell>
                  <TableCell align="center">{v.personnel.unterfuehrer}</TableCell>
                  <TableCell align="center">{v.personnel.helfer}</TableCell>
                  <TableCell align="center">
                    <strong>{v.personnel.sum}</strong>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default Home;
