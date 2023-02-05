import {
  IterableResponse,
  List,
  Review,
} from '@/features/list/services/list.service';
import { $list, $listState, getList } from '@/models/singleList';
import { Image, Row, Text, Textarea } from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import lock from '@/features/list/components/img/lock.svg';

const ListPage = ({
  listWithContent: { list, reviews },
}: {
  listWithContent: {
    reviews: IterableResponse<Review>;
    list: List;
  };
}) => {
  const getUpdatedAt = () => {
    const date = new Date(list.updated_at);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + date.getMonth()).slice(-2);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`
  } 
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
        Создатель <Link to={'/'}>username123</Link>
      </Text>
      <Text as={'p'} color="$neutral" css={{ mb: '$10' }}>
        Обновлен {getUpdatedAt()}
      </Text>

      <Text h2>Фильмы</Text>
      {reviews.items.map((review) => (
        <>
          <Text>Описание {review.description}</Text>
          <Text>Теги {String(review.tags)}</Text>
          <Text>Оценка {String(review.score)}</Text>
          <div>
            <Image
              src={review.film.posterPreviewUrl}
              width={100}
              height={100}
              objectFit="contain"
            />
            <Text h4>{review.film.name}</Text>
            <Text>Год{review.film.year}</Text>
          </div>
        </>
      ))}
    </>
  );
};

const ListPageWithData = () => {
  const { id } = useParams();
  const getListWithContent = useEvent(getList);
  const listWithContent = useStore($list);

  useEffect(() => {
    getListWithContent(Number(id));
  }, []);

  const { error, list, loading } = useStore($listState);

  if (loading) {
    return null;
  }

  if (error) {
    return <>Ошибка... {error}</>;
  }

  if (list !== null) {
    return <ListPage listWithContent={listWithContent!} />;
  }

  return null;
};

export default ListPageWithData;
