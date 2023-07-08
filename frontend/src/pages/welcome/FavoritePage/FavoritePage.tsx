import { useStore } from 'effector-react';
import { useEffect } from 'react';
import {
  $getFavoriteListsLoading,
  $getMoreFavoritesLoading,
  getFavoriteLists,
  getMoreFavorites,
} from '@/features/list/favorite-lists';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';
import { $favoriteLists } from '@/features/list/_model/favoriteLists';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { Text } from '@nextui-org/react';

const FavoritePage = () => {
  useEffect(getFavoriteLists, []);
  const favLists = useStore($favoriteLists);
  const loadingMore = useStore($getMoreFavoritesLoading);
  const loading = useStore($getFavoriteListsLoading);

  useLoadingBar(loading, loadingMore);
  
  return 'page'

  // return (
  //   <>
  //     {favLists?.length === 0 ? (
  //       <Text size={'$lg'} color="$neutral">
  //         Нет избранных коллекций
  //       </Text>
  //     ) : (
  //       <ListGrid
  //         items={(favLists ?? []).map((f) => f.list)}
  //         canLoadMore={Boolean(false)}
  //         // loadMore={
  //         //   favLists?.nextKey
  //         //     ? () => getMoreFavorites({ lowerBound: favLists.nextKey! })
  //         //     : undefined
  //         // }
  //         loadingMore={loadingMore}
  //       />
  //     )}
  //   </>
  // );
};

export default FavoritePage;
