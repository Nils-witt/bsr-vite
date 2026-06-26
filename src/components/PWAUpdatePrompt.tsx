import { Button, Snackbar, SnackbarContent, Stack } from '@mui/material';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { useRegisterSW } from 'virtual:pwa-register/react';

function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  function dismiss() {
    setNeedRefresh(false);
  }

  return (
    <Snackbar open={needRefresh} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
      <SnackbarContent
        message={
          <Stack direction="row" alignItems="center" gap={1}>
            <SystemUpdateAltIcon fontSize="small" />
            A new version is available.
          </Stack>
        }
        action={
          <Stack direction="row" gap={1}>
            <Button color="inherit" size="small" onClick={() => updateServiceWorker(true)}>
              Reload
            </Button>
            <Button color="inherit" size="small" onClick={dismiss}>
              Dismiss
            </Button>
          </Stack>
        }
      />
    </Snackbar>
  );
}

export default PWAUpdatePrompt;
