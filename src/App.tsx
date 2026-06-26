import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const VehicleGrid = lazy(() => import('./pages/VehicleGrid'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <>
      <NavBar />
      <Suspense
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
          </Box>
        }
      >
        <Routes>
          <Route path="/" element={<VehicleGrid />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
