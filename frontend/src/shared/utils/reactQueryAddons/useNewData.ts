import { UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';

/** Runs a callback only when new data is fetched */
export const useNewData = (
  queryResult: UseQueryResult,
  callback: () => void,
) => {
  useEffect(() => {
    const isOutdated =
      !queryResult.data ||
      queryResult.isFetching ||
      !queryResult.isFetchedAfterMount;

    if (isOutdated) {
      return;
    }

    callback();
  }, [queryResult.isFetching]);
};
