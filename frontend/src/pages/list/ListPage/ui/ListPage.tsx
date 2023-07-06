import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { Text } from '@nextui-org/react';
import { useListPage } from '../hooks/useListPage';
import { PageContent } from './PageContent';
import { useEarlierLoadedList } from '../hooks/useEarlierLoadedList';
import { FC } from 'react';

export const ListPage: FC = () => {
  const { data, error, isLoading } = useListPage();
  const { earlierLoadedList } = useEarlierLoadedList();

  useLoadingBar(isLoading);

  if (data) {
    return (
      <PageContent
        list={data.list}
        additionalInfo={data.additionalInfo}
        reviews={data.reviews}
      />
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
