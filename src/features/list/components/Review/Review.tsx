import React, { useState } from 'react';
import {
  Card,
  styled,
  Image,
  Text,
  Link as NextUILink,
} from '@nextui-org/react';
import { Review } from '@/shared/api/types/review.type';
import { IconButton } from '@/shared/ui/IconButton';
import gear from '@/assets/img/gear.svg';
import ReviewModal from '@/features/review/components/ReviewModal/ReviewModal';

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

const ReviewWrapper = styled('div', {
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
  background: '$gray50',
  borderRadius: '$lg',
  position: 'relative',
});

const EditButton = styled(IconButton, {
  position: 'absolute',
  top: '$sm',
  right: '$sm',
});
interface ReviewItemProps {
  review: Review;
  isUserOwner: boolean;
}

const ReviewItem = ({ review, isUserOwner }: ReviewItemProps) => {
  return (
    <>
      <ReviewWrapper>
        {isUserOwner && (
          <EditButton light>
            <Image src={gear} width={'1.5rem'} height={'1.5rem'} />
          </EditButton>
        )}
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
      </ReviewWrapper>
    </>
  );
};

export default ReviewItem;
