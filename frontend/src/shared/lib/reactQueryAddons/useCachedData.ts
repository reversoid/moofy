import { UseInfiniteQueryResult, UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';

/** Runs a callback only when we get cached data */
export const useCachedData = (
  queryResult: UseQueryResult,
  callback: () => void,
) => {
  useEffect(() => {
    const isCached = queryResult.data || !queryResult.isFetchedAfterMount;

    if (!isCached) {
      return;
    }

    callback();
  }, [queryResult.isFetchedAfterMount, queryResult.isLoading]);
};
