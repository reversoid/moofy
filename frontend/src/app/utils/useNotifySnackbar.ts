import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { $appNotifyStore } from '@/features/app/model/notify';

export const useNotifySnackbar = () => {
  const message = useStore($appNotifyStore);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(Boolean(message.message));

  useEffect(() => {
    setIsSnackbarOpen(Boolean(message.message));
  }, [message]);

  const handleSnackbarClose = useCallback(() => {
    setIsSnackbarOpen(false);
  }, []);

  return { isSnackbarOpen, notifyMessage: message.message, handleSnackbarClose };
};
