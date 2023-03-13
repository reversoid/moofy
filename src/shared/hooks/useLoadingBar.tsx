import { setLoading as setGlobalLoading } from '@/models/app/loading';
import { useEffect, useState } from 'react';

/** Truthy values given will envoke loader appear */
export const useLoadingBar = (...args: boolean[]) => {
  const isLoading = args.some(Boolean);
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    const isLoading = args.some(Boolean);
    setLoading(isLoading);

    return () => {
      setGlobalLoading(false);
    };
  }, [args]);

  useEffect(() => {
    setGlobalLoading(loading);
  }, [loading]);
};
