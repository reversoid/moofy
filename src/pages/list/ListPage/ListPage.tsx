import {
  IterableResponse,
  List,
  Review,
} from '@/features/list/services/list.service';
import { $list, $listState, getList } from '@/models/singleList';
import {
  Image,
  Row,
  Text,
  styled,
} from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import lock from '@/assets/img/lock.svg';
import ReviewItem from '@/features/list/components/Review/Review';
 
const FilmsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$8',
});

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
        Создатель <Link to={'/profile/1'}>username123</Link>
      </Text>
      <Text as={'p'} color="$neutral" css={{ mb: '$10' }}>
        Обновлен {getUpdatedAt()}
      </Text>

      <Text h2 css={{ mb: '$5' }}>
        Фильмы
      </Text>
      <FilmsContainer>
        {reviews.items.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </FilmsContainer>
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
