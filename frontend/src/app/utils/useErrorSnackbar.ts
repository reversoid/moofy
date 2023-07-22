import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { $appErrorStore } from '@/app';

export const useErrorSnackbar = () => {
  const error = useStore($appErrorStore);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(Boolean(error.error));

  useEffect(() => {
    setIsSnackbarOpen(Boolean(error.error));
  }, [error]);

  const handleSnackbarClose = useCallback(() => {
    setIsSnackbarOpen(false);
  }, []);

  return { isSnackbarOpen, errorMessage: error.error, handleSnackbarClose };
};
