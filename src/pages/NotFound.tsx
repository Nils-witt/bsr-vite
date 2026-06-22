import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h1" color="text.secondary">
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page not found
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go home
      </Button>
    </Box>
  );
}

export default NotFound;
