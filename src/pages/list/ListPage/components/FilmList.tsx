import ReviewItem from '@/features/list/components/Review/Review';
import { Review } from '@/features/list/services/list.service';
import { Button, Loading, Row, styled, Text } from '@nextui-org/react';
import { memo } from 'react';

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
            <Button color={'gradient'}>Добавить</Button>
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
    </>
  );
};

export default memo(FilmList);
