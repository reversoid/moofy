import React from 'react';
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
});

export const ErrorSnackBar = ({
  open,
  message,
  closeSnackBar,
}: ErrorSnackBarprops) => {
  return (
    <SnackBarStyled
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      autoHideDuration={4000}
      onClose={closeSnackBar}
    >
      <Alert severity="error" onClose={closeSnackBar} variant="filled">
        {message}
      </Alert>
    </SnackBarStyled>
  );
};
