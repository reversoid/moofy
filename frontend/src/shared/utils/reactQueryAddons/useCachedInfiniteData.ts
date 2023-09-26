import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';

/** Runs a callback only when we get cached data */
export const useCachedInfiniteData = <T>(
  queryResult: UseInfiniteQueryResult,
  callback: () => void,
) => {
  useEffect(() => {
    const isCached = queryResult.data || !queryResult.isFetchedAfterMount;

    if (!isCached) {
      return;
    }

    callback();
  }, [queryResult.isFetchedAfterMount, queryResult.isFetchingNextPage]);
};
