import React from 'react';
import {
  Card,
  styled,
  Image,
  Text,
  Link as NextUILink,
} from '@nextui-org/react';
import { Review } from '@/shared/api/types/review.type';

const ImageContainer = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
});

const FilmInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  flexGrow: 1,
});

const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <>
      <Card
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          gap: '$6',
          padding: '$6',
          '@xsMax': {
            flexDirection: 'column',
            paddingTop: '$7',
            paddingBottom: '$7',
          },
        }}
      >
        <ImageContainer>
          <Image
            showSkeleton
            src={review.film.posterPreviewUrl}
            width={'6.75rem'}
            objectFit="cover"
            css={{
              flexShrink: 0,
              aspectRatio: '27 / 40',
            }}
          />
        </ImageContainer>
        <FilmInfo>
          <Text h4 css={{ mb: '$1', lineHeight: '$sm' }}>
            <NextUILink
              href={`https://kinopoisk.ru/film/${review.film.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {review.film.name}
            </NextUILink>
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

export default ReviewItem;
