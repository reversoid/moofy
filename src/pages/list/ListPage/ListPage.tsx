import {
  IterableResponse,
  List,
  Review,
} from '@/features/list/services/list.service';
import { $list, $listState, getList } from '@/models/lists/singleList';
import { useEvent, useStore } from 'effector-react';
import React, { memo, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { $lists } from '@/models/lists';
import ErrorPage from '@/pages/ErrorPage/ErrorPage';
import { useAuth } from '@/shared/hooks/useAuth';
import FilmList from './components/FilmList';
import ListInfo from './components/ListInfo';

const ListPage = ({
  listWithContent: { list, reviews },
}: {
  listWithContent: {
    reviews?: IterableResponse<Review>;
    list: List;
  };
}) => {
  const { userId } = useAuth();

  return (
    <>
      <ListInfo list={list} isUserOwner={userId === list.user.id} />
      <FilmList
        isUserOwner={userId === list.user.id}
        reviews={reviews?.items}
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

  if (list) {
    return <ListPage listWithContent={{ ...listWithContent! }} />;
  }

  if (listAlreadyLoaded) {
    return <ListPage listWithContent={{ list: listAlreadyLoaded }} />;
  }

  if (loading) {
    return null;
  }

  return null;
};

export default memo(ListPageWithData);
