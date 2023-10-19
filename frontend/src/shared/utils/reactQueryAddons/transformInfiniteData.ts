import { IterableResponse } from '@/shared/api/types/shared';
import { InfiniteData } from '@tanstack/react-query';

/** Transforms React query infinite iterable data into array  */
export const transformInfiniteIterableData = <T>(
  data: InfiniteData<IterableResponse<T>>,
): T[] => {
  return data.pages.reduce((acc, value) => [...acc, ...value.items], [] as T[]);
};
