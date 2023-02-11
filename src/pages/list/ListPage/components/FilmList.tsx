import ReviewItem from '@/features/list/components/Review/Review';
import { Review } from '@/features/list/services/list.service';
import AddFilmModal from '@/features/review/components/AddReviewModal/AddReviewModal';
import { Button, Loading, Row, styled, Text } from '@nextui-org/react';
import { memo, useState } from 'react';
import { Link } from '@/shared/ui/Link';

const FilmsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$8',
});

interface ReviewListProps {
  reviews?: Review[];
  isUserOwner: boolean;
}

const FilmList = ({ reviews, isUserOwner }: ReviewListProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Row align="center" justify="flex-start" css={{ gap: '$8' }}>
        <Text h2 css={{ mb: '$5' }}>
          Фильмы
        </Text>
        {!reviews && <Loading size="md" type="default" />}
      </Row>
      {reviews?.length === 0 && !isUserOwner ? (
        <Text color="$neutral">Список пуст</Text>
      ) : (
        <>
          {isUserOwner && reviews && (
            <Link to="add">
              <Button
                color={'gradient'}
                css={{ mb: '$8' }}
                onPress={() => setModalOpen(true)}
              >
                Добавить
              </Button>
            </Link>
          )}

          <FilmsContainer>
            {reviews?.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </FilmsContainer>
        </>
      )}
    </>
  );
};

export default memo(FilmList);
