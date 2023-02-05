import {
  IterableResponse,
  List,
  Review,
} from '@/features/list/services/list.service';
import { $list, $listState, getList } from '@/models/singleList';
import { Image, Loading, Row, Text, styled } from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import lock from '@/assets/img/lock.svg';
import ReviewItem from '@/features/list/components/Review/Review';
import { $lists } from '@/models/lists';
import { log } from 'console';
import NotFoundPage from '@/pages/404/404';

const FilmsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$8',
});

const ReviewList = ({ reviews }: { reviews?: Review[] }) => {
  // TODO add create link if user is an owner

  return (
    <>
      <Row align="center" justify="flex-start" css={{ gap: '$8' }}>
        <Text h2 css={{ mb: '$5' }}>
          Фильмы
        </Text>
        {!reviews && <Loading size="md" type="default" />}
      </Row>
      {reviews?.length === 0 ? (
        <Text color="$neutral">Список пуст</Text>
      ) : (
        <FilmsContainer>
          {reviews?.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </FilmsContainer>
      )}
    </>
  );
};

const ListPage = ({
  listWithContent: { list, reviews },
}: {
  listWithContent: {
    reviews?: IterableResponse<Review>;
    list: List;
  };
}) => {
  const getUpdatedAt = () => {
    const date = new Date(list.updated_at);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + date.getMonth()).slice(-2);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  return (
    <>
      <Row align="center" css={{ gap: '$10' }}>
        <Text h1>{list.name}</Text>
        {!list.is_public && (
          <div>
            <Image src={lock} height={'1.5rem'} width={'1.5rem'}></Image>
          </div>
        )}
      </Row>
      <Text as={'p'} css={{ mb: '$5' }}>
        {list.description}
      </Text>

      <Text as={'p'} color="$neutral">
        Создатель <Link to={`/profile/${list.user.id}`}>{list.user.username}</Link>
      </Text>
      <Text as={'p'} color="$neutral" css={{ mb: '$10' }}>
        Обновлен {getUpdatedAt()}
      </Text>

      <ReviewList reviews={reviews?.items} />
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

  if (error) {
    return <NotFoundPage />;
  }

  return null;
};

export default memo(ListPageWithData);
