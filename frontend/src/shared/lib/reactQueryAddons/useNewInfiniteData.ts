import { useEffect } from 'react';

/** Runs a callback only when new data is fetched */
export const useNewInfiniteData = <T>(
  data: T,
  isFetchingNextPage: boolean,
  isFetchedAfterMount: boolean,
  callback: () => void,
) => {
  useEffect(() => {
    const isOutdated = !data || isFetchingNextPage || !isFetchedAfterMount;
    if (isOutdated) {
      return;
    }

    callback();
  }, [isFetchedAfterMount, isFetchingNextPage]);
};
