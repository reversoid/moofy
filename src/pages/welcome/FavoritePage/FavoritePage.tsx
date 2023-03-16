import ListGrid from '@/features/list/components/ListGrid/ListGrid';
import {
  $favoriteLists,
  $favoriteListsLoading,
  loadFavoriteLists,
} from '@/models/favoriteLists';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { Text } from '@nextui-org/react';
import { useStore } from 'effector-react';
import React, { memo, useEffect, useMemo } from 'react';

const FavoritePage = () => {
  useEffect(() => {
    loadFavoriteLists();
  }, []);
  const favLists = useStore($favoriteLists);
  const listsLoading = useStore($favoriteListsLoading);
  useLoadingBar(listsLoading);

  const lists = useMemo(() => {
    if (!favLists) return [];
    return [...favLists.items]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map((f) => f.list);
  }, [favLists]);

  // return <Text size={'$xl'}>Список пуст</Text>;
  return <ListGrid items={lists} />;
};

export default memo(FavoritePage);
