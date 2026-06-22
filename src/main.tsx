import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { WebRTCSyncProvider } from './context/WebRTCSyncContext';
import VehiclePersistenceProvider from './context/VehiclePersistenceProvider';
import App from './App.tsx';
import './index.scss';
const theme = createTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <VehiclePersistenceProvider>
            <WebRTCSyncProvider>
              <App />
            </WebRTCSyncProvider>
          </VehiclePersistenceProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
