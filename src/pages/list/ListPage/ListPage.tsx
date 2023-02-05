import {
  Film,
  IterableResponse,
  List,
  Review,
} from '@/features/list/services/list.service';
import { $list, $listState, getList } from '@/models/singleList';
import {
  Card,
  Image,
  Row,
  Text,
  Textarea,
  styled,
  Link as NextUiLink,
} from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import lock from '@/features/list/components/img/lock.svg';
import { log } from 'console';

const ImageContainer = styled('div', {
  flexShrink: 0,
});

const FilmInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  flexGrow: 1,
});

const mockLink =
  'https://kinopoiskapiunofficial.tech/images/posters/kp_small/307.jpg';

const mockText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam bibendum laoreet urna, vel egestas eros congue at. Pellentesque sit amet odio cursus, pulvinar arcu ut, pretium purus. In suscipit lectus eget nisl ultrices porta. Aliquam tempor pellentesque sollicitudin. Curabitur`;

const FilmItem = ({ review }: { review: Review }) => {
  console.log(review);
  return (
    <>
      <Card
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          gap: '$6',
          padding: '$3 $6',
        }}
      >
        <ImageContainer>
          <Image
            showSkeleton
            src={review.film.posterPreviewUrl}
            width={'6.75rem'}
            height={'10rem'}
            objectFit="contain"
            css={{ flexShrink: 0 }}
          />
        </ImageContainer>
        <FilmInfo>
          <Text h4 css={{ mb: '$1', lineHeight: '$sm' }}>
            <NextUiLink
              href={`https://kinopoisk.ru/film/${review.film.id}`}
              target="blank"
              rel="noopenner norefferer"
            >
              {review.film.name}
            </NextUiLink>
          </Text>
          <Text b color="$neutral" css={{ mb: '$4', lineHeight: 1 }}>
            {review.film.year}
          </Text>
          <Text as={'p'} css={{ flexShrink: 1, lineHeight: '$md' }}>
            {review.description}
          </Text>
        </FilmInfo>
      </Card>
    </>
  );
};

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
        Создатель <Link to={'/'}>username123</Link>
      </Text>
      <Text as={'p'} color="$neutral" css={{ mb: '$10' }}>
        Обновлен {getUpdatedAt()}
      </Text>

      <Text h2 css={{ mb: '$5' }}>
        Фильмы
      </Text>
      <FilmsContainer>
        {reviews.items.map((review) => (
          <FilmItem key={review.id} review={review} />
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
