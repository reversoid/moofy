import { useEffect } from 'react';

export const useUnmount = (callback: () => void) => {
  useEffect(() => callback(), []);
};
