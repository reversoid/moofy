import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { IterableResponse } from '@/shared/api/types/shared';
import { InfiniteData } from '@tanstack/react-query';

export const transformResponse = (
  data: InfiniteData<IterableResponse<FavoriteList>>,
): FavoriteList[] => {
  return data.pages.reduce((acc, value) => [...acc, ...value.items], [] as FavoriteList[]);
};
