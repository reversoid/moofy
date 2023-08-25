import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';
import { Text } from '@nextui-org/react';
import { useFavoritePage } from './utils/useFavoritePage';

const FavoritePage = () => {
  const {
    data: favLists,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useFavoritePage();

  useLoadingBar(isLoading);

  return (
    <>
      {favLists?.length === 0 && !isLoading ? (
        <Text size={'$lg'} color="$neutral">
          Нет избранных коллекций
        </Text>
      ) : (
        <ListGrid
          items={(favLists ?? []).map((f) => f.list)}
          canLoadMore={hasNextPage}
          loadMore={fetchNextPage}
          loadingMore={isFetchingNextPage}
        />
      )}
    </>
  );
};

export default FavoritePage;
