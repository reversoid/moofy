import { $list, $listState, getList } from '@/models/lists/singleList';
import { useEvent, useStore } from 'effector-react';
import React, { memo, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { $lists } from '@/models/lists';
import { useAuth } from '@/shared/hooks/useAuth';
import ReviewList from './components/ReviewList';
import ListInfo from './components/ListInfo';
import { Review } from '@/shared/api/types/review.type';
import { IterableResponse } from '@/shared/api/types/shared';
import { List } from '@/shared/api/types/list.type';
import { Text } from '@nextui-org/react';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';

interface ListPageProps {
  listWithContent: {
    reviews?: IterableResponse<Review>;
    list: List;
  };
}

const ListPage = ({ listWithContent: { list, reviews } }: ListPageProps) => {
  const { userId } = useAuth();

  return (
    <>
      <ListInfo list={list} isUserOwner={userId === list.user.id} />
      <ReviewList
        isUserOwner={userId === list.user.id}
        reviews={reviews}
        listId={list.id}
      />
    </>
  );
};

const ListPageWithData = () => {
  const { id } = useParams();
  const getListWithContent = useEvent(getList);

  useEffect(() => {
    getListWithContent(Number(id));
  }, []);

  const lists = useStore($lists);
  const listWithContent = useStore($list);

  const { error, list, loading } = useStore($listState);

  const listAlreadyLoaded = useMemo(
    () => lists.items.find((list) => list.id === Number(id)),
    [],
  );

  const listWithContentAlreadyLoaded = useMemo(
    () => Boolean(list && list.list.id === Number(id)),
    [list],
  );

  useLoadingBar(loading);

  if (listWithContentAlreadyLoaded) {
    return <ListPage listWithContent={{ ...listWithContent! }} />;
  }

  if (listAlreadyLoaded) {
    return <ListPage listWithContent={{ list: listAlreadyLoaded }} />;
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

export default memo(ListPageWithData);
