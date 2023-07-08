import { IterableResponse } from '@/shared/api/types/shared';
import { InfiniteData } from '@tanstack/react-query';

/** Transforms React query infinite data into array  */
export const transformInfiniteData = <T>(
  data: InfiniteData<IterableResponse<T>>,
) => {
  return data.pages.reduce((acc, value) => [...acc, ...value.items], [] as T[]);
};
