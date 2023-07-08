import { List } from '@/shared/api/types/list.type';
import { IterableResponse } from '@/shared/api/types/shared';
import { InfiniteData } from '@tanstack/react-query';

export const transformResponse = (
  data: InfiniteData<IterableResponse<List>>,
): List[] => {
  return data.pages.reduce(
    (acc, value) => [...value.items, ...acc],
    [] as List[],
  );
};
