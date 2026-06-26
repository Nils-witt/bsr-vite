import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import SyncPanel from './SyncPanel';
import { version } from '../../package.json';

function NavBar() {
  return (
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
        <SyncPanel />
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
