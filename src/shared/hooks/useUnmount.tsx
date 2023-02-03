import { useEffect } from 'react';

export const useUnmount = (callback: (...args: any) => void) => {
  useEffect(() => callback, []);
};
