import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { Text } from '@nextui-org/react';
import { useListPage } from '../utils/hooks/useListPage';
import { PageContent } from './PageContent';
import { useEarlierLoadedList } from '../utils/hooks/useEarlierLoadedList';
import { FC, createContext } from 'react';
import { useParams } from 'react-router-dom';

const useId = () => {
  const { id } = useParams();
  return Number(id);
};

export const ListPageContext = createContext<{ id: number | undefined }>({
  id: undefined,
});

export const ListPage: FC = () => {
  const id = useId();

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListPage(id);

  const { earlierLoadedList } = useEarlierLoadedList(id);

  useLoadingBar(isLoading);

  if (data) {
    return (
      <ListPageContext.Provider value={{ id }}>
        <PageContent
          list={data.list}
          additionalInfo={data.additionalInfo}
          reviews={data.reviews}
          loadMoreReviews={fetchNextPage}
          canLoadMoreReviews={hasNextPage}
          isFetchingMore={isFetchingNextPage}
        />
      </ListPageContext.Provider>
    );
  }

  if (earlierLoadedList) {
    return <PageContent list={earlierLoadedList} />;
  }

  if (error?.cause.message === 'NOT_ALLOWED') {
    return (
      <>
        <Text size={'$lg'}>Коллекция скрыта пользователем</Text>
      </>
    );
  }

  if (error?.cause.message === 'WRONG_LIST_ID') {
    return (
      <>
        <Text size={'$lg'}>Коллекция недоступна</Text>
      </>
    );
  }

  return null;
};

export default ListPage;
