import { useErrorSnackbar } from '@/app/utils/useErrorSnackbar';
import { Alert, Snackbar } from '@mui/material';
import { styled } from '@nextui-org/react';

export interface ErrorSnackBarprops {
  open: boolean;
  message: string;
  closeSnackBar: () => void;
}

const SnackBarStyled = styled(Snackbar, {
  '& .MuiAlert-filledError': {
    background: '$error',
    fontFamily: 'inherit',
  },
  zIndex: '10000 !important',
});

export const ErrorSnackbar = () => {
  const { errorMessage, handleSnackbarClose, isSnackbarOpen } =
    useErrorSnackbar();

  return (
    <SnackBarStyled
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={isSnackbarOpen}
      autoHideDuration={4000000}
      onClose={handleSnackbarClose}
    >
      <Alert severity="error" onClose={handleSnackbarClose} variant="filled">
        {errorMessage}
      </Alert>
    </SnackBarStyled>
  );
};
