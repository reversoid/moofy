import { useNotifySnackbar } from '@/app/utils/useNotifySnackbar';
import { Alert, Snackbar } from '@mui/material';
import { styled } from '@nextui-org/react';

const SnackBarStyled = styled(Snackbar, {
  '& .MuiAlert-filledSuccess': {
    background: '$primary',
    fontFamily: 'inherit',
  },
  zIndex: '10000 !important',
});

export const NotifySnackbar = () => {
  const { handleSnackbarClose, isSnackbarOpen, notifyMessage } =
    useNotifySnackbar();

  return (
    <SnackBarStyled
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={isSnackbarOpen}
      autoHideDuration={4000}
      onClose={handleSnackbarClose}
    >
      <Alert severity="success" onClose={handleSnackbarClose} variant="filled">
        {notifyMessage}
      </Alert>
    </SnackBarStyled>
  );
};
