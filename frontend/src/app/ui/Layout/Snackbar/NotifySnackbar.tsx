import React, { memo } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { styled } from '@nextui-org/react';

export interface ErrorSnackBarprops {
  open: boolean;
  message: string;
  closeSnackBar: () => void;
}

const SnackBarStyled = styled(Snackbar, {
  '& .MuiAlert-filledSuccess': {
    background: '$primary',
    fontFamily: 'inherit',
  },
  zIndex: '10000 !important',
});

export const NotifySnackbar = ({
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
      <Alert severity="success" onClose={closeSnackBar} variant="filled">
        {message}
      </Alert>
    </SnackBarStyled>
  );
};
