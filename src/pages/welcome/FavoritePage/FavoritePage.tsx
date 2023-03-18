import { useStore } from 'effector-react';
import { memo, useEffect } from 'react';
import {
  $getMoreFavoritesLoading,
  getFavoriteLists,
  getMoreFavorites,
} from '@/features/list/favorite-lists';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';
import { $favoriteLists } from '@/features/list/_model/favoriteLists';

const FavoritePage = () => {
  useEffect(getFavoriteLists, []);
  const favLists = useStore($favoriteLists);
  const loadingMore = useStore($getMoreFavoritesLoading);

  return (
    <>
      <ListGrid
        items={(favLists?.items ?? []).map((f) => f.list)}
        canLoadMore={Boolean(favLists?.nextKey)}
        loadMore={
          favLists?.nextKey
            ? () => getMoreFavorites({ lowerBound: favLists.nextKey! })
            : undefined
        }
        loadingMore={loadingMore}
      />
    </>
  );
};

export default memo(FavoritePage);
