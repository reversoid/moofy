import { $lists, $singleList } from '@/features/list/_model';
import { $getListState, getList } from '@/features/list/get-list';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { useStore } from 'effector-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageContent } from './PageContent';
import { Text } from '@nextui-org/react';

export const ListPage = () => {
  const { id } = useParams();

  useEffect(() => {
    getList(Number(id));
  }, []);

  const lists = useStore($lists);

  const { error, loading } = useStore($getListState);
  const listWithContent = useStore($singleList);

  const listAlreadyLoaded = lists?.items.find((list) => list.id === Number(id));

  const listWithContentAlreadyLoaded = Boolean(
    listWithContent && listWithContent.list.id === Number(id),
  );

  useLoadingBar(loading);

  if (listWithContentAlreadyLoaded) {
    return <PageContent listWithContent={{ ...listWithContent! }} />;
  }

  if (listAlreadyLoaded) {
    return <PageContent listWithContent={{ list: listAlreadyLoaded }} />;
  }

  if (loading) {
    return null;
  }

  if (error === 'NOT_ALLOWED') {
    return (
      <>
        <Text size={'$lg'}>Коллекция скрыта пользователем</Text>
      </>
    );
  }

  if (error === 'WRONG_LIST_ID') {
    return (
      <>
        <Text size={'$lg'}>Коллекция недоступна</Text>
      </>
    );
  }

  return null;
};

export default ListPage;
