import ReviewItem from '@/features/list/components/Review/Review';
import { Review } from '@/features/list/services/list.service';
import AddReviewModal from '@/features/review/components/AddReviewModal/AddReviewModal';
import { Button, Loading, Row, styled, Text } from '@nextui-org/react';
import { memo, useState } from 'react';

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
      {reviews?.length === 0 ? (
        <>
          {isUserOwner ? (
            <Button color={'gradient'} onPress={() => setModalOpen(true)}>Добавить</Button>
          ) : (
            <Text color="$neutral">Список пуст</Text>
          )}
        </>
      ) : (
        <FilmsContainer>
          {reviews?.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </FilmsContainer>
      )}
      <AddReviewModal isOpen={modalOpen} setIsOpen={setModalOpen} />
    </>
  );
};

export default memo(FilmList);
