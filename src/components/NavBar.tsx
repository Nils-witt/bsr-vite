import { useState } from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { Link } from 'react-router-dom';
import SyncPanel from './SyncPanel';
import GlobalLogDrawer from './GlobalLogDrawer';
import { version } from '../../package.json';

function NavBar() {
  const [logOpen, setLogOpen] = useState(false);

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
          <IconButton color="inherit" onClick={() => setLogOpen(true)}>
            <HistoryIcon />
          </IconButton>
          <SyncPanel />
        </Toolbar>
      </AppBar>
      <GlobalLogDrawer open={logOpen} onClose={() => setLogOpen(false)} />
    </>
  );
}

export default NavBar;
