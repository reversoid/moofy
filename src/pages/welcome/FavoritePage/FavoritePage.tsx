import ListGrid from '@/features/list/components/ListGrid/ListGrid';
import {
  $favoriteLists,
  $favoriteListsLoading,
  loadFavoriteLists,
} from '@/models/favoriteLists';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { Button, Loading, Text } from '@nextui-org/react';
import { useStore } from 'effector-react';
import React, { memo, useEffect, useMemo } from 'react';
import { LoadMoreContainer } from '../Layout';
import {
  $loadMoreFavoritesLoading,
  loadMoreFavorites,
} from '@/models/favoriteLists/loadMoreFavorites';

const FavoritePage = () => {
  useEffect(() => {
    loadFavoriteLists();
  }, []);
  const favLists = useStore($favoriteLists);
  const listsLoading = useStore($favoriteListsLoading);

  const lists = useMemo(() => {
    if (!favLists) return [];
    return [...favLists.items]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map((f) => f.list);
  }, [favLists]);

  const loadMoreLoading = useStore($loadMoreFavoritesLoading);

  useLoadingBar(listsLoading, loadMoreLoading);

  const handleLoadMore = () => {
    if (loadMoreLoading || !favLists?.nextKey) {
      return;
    }
    loadMoreFavorites({ lowerBound: favLists.nextKey });
  };

  return (
    <>
      <ListGrid items={lists} />
      {favLists?.nextKey && (
        // TODO maybe use component with pagination?
        <LoadMoreContainer>
          <Button color="gradient" onPress={handleLoadMore}>
            {loadMoreLoading ? (
              <Loading type="points" color="white" />
            ) : (
              'Загрузить больше'
            )}
          </Button>
        </LoadMoreContainer>
      )}
    </>
  );
};

export default memo(FavoritePage);
