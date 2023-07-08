import { UseInfiniteQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';

/** Runs a callback only when new data is fetched */
export const useNewInfiniteData = <T>(
  queryResult: UseInfiniteQueryResult,
  callback: () => void,
) => {
  useEffect(() => {
    const isOutdated =
      !queryResult.data ||
      queryResult.isFetchingNextPage ||
      !queryResult.isFetchedAfterMount;

    if (isOutdated) {
      return;
    }

    callback();
  }, [queryResult.isFetchedAfterMount, queryResult.isFetchingNextPage]);
};
