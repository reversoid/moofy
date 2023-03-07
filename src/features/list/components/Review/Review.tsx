import UpdateReviewModal from '@/features/review/components/UpdateReviewModal/UpdateReviewModal';
import { deleteReview } from '@/models/reviews/deleteReview';
import { Review } from '@/shared/api/types/review.type';
import ActionsDropdown, { Option } from '@/shared/ui/ActionsDropdown';
import { Image, Link as NextUILink, Text, styled } from '@nextui-org/react';
import { useMemo, useState } from 'react';
import GearButton from './GearButton';
import { COLORS } from '@/features/review/components/Counter/Counter';

const ImageContainer = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  '@xsMax': {
    justifyContent: 'center',
  },
  '& .nextui-image-container': {
    margin: '0 !important',
  },
});

const ImgWrapper = styled('div');

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

const Score = styled('div', {
  padding: '0 0.25rem',
  fontSize: '$sm',
  background: '$red100',
  lineHeight: 1.25
});

interface ReviewItemProps {
  review: Review;
  isUserOwner: boolean;
}

const GearButtonStyled = styled(GearButton, {
  position: 'absolute',
  top: '$sm',
  right: '$sm',
});

const ReviewItem = ({ review, isUserOwner }: ReviewItemProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const dropdownOptions: Option[] = useMemo(() => {
    return [
      {
        key: 'update',
        callback: () => setEditModalOpen(true),
        label: 'Изменить',
      },
      {
        key: 'delete',
        callback: () => deleteReview({ reviewId: review.id }),
        label: 'Удалить',
        color: 'error',
      },
    ];
  }, []);

  const description = useMemo(() => {
    return review.description.replace(/\n/g, '<br />');
  }, [review.description]);

  const color = review.score ? COLORS[review.score - 1] : null;

  return (
    <>
      <ReviewWrapper>
        {isUserOwner && (
          <ActionsDropdown
            trigger={<GearButtonStyled />}
            options={dropdownOptions}
            placement="left"
          />
        )}
        <ImageContainer>
          <ImgWrapper
            css={{
              position: 'relative',
            }}
          >
            <Image
              showSkeleton
              src={review.film.posterPreviewUrl}
              width={'6.75rem'}
              height={'10rem'}
              objectFit="cover"
              css={{
                flexShrink: 0,
                aspectRatio: '27 / 40',
              }}
            />
            {review.score && (
              <Score
                css={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: color ?? '',
                  color: ['#ffc20d', '#fef200', '#cadb2a'].includes(color ?? '')
                    ? '#2e2e2e'
                    : 'white',
                }}
              >
                {review.score}
              </Score>
            )}
          </ImgWrapper>
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
          <Text
            as={'p'}
            css={{ flexShrink: 1, lineHeight: '$md', fontSize: '$lg' }}
            dangerouslySetInnerHTML={{ __html: description }}
          ></Text>
        </FilmInfo>
        <UpdateReviewModal
          isOpen={editModalOpen}
          setIsOpen={setEditModalOpen}
          reviewId={review.id}
          formData={{
            description: review.description,
            score: review.score,
          }}
        />
      </ReviewWrapper>
    </>
  );
};

export default ReviewItem;
