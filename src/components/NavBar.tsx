import { lazy, Suspense, useState } from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { Link } from 'react-router-dom';
import SyncPanel from './SyncPanel';
import { version } from '../../package.json';

const GlobalLogDrawer = lazy(() => import('./GlobalLogDrawer'));

function NavBar() {
  const [logOpen, setLogOpen] = useState(false);
  const [logMounted, setLogMounted] = useState(false);

  function openLog() {
    setLogMounted(true);
    setLogOpen(true);
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}
          >
            BSR
            <Typography component="span" variant="caption" sx={{ ml: 1, opacity: 0.7 }}>
              v{version}
            </Typography>
          </Typography>
          <IconButton color="inherit" onClick={openLog}>
            <HistoryIcon />
          </IconButton>
          <SyncPanel />
        </Toolbar>
      </AppBar>
      {logMounted && (
        <Suspense fallback={null}>
          <GlobalLogDrawer open={logOpen} onClose={() => setLogOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

export default NavBar;
