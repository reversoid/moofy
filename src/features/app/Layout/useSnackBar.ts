import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { $appErrorStore } from '@/models/app/errors';

export const useSnackbar = () => {
  const error = useStore($appErrorStore);

  const [isSnackBarOpen, setIsSnackBarOpen] = useState(Boolean(error.error));

  useEffect(() => {
    setIsSnackBarOpen(Boolean(error.error));
  }, [error]);

  const handleSnackbarClose = useCallback(() => {
    setIsSnackBarOpen(false);
  }, []);

  return { isSnackBarOpen, errorMessage: error.error, handleSnackbarClose };
};
