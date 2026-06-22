import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import SyncPanel from './SyncPanel';

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
        </Typography>
        <SyncPanel />
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
