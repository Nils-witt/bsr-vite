import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import NotFound from './pages/NotFound';
import VehicleGrid from './pages/VehicleGrid.tsx';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<VehicleGrid />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
