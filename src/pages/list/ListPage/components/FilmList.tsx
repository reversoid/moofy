import ReviewItem from '@/features/list/components/Review/Review';
import { Review } from '@/shared/api/types/review.type';
import { Button, Loading, Row, styled, Text } from '@nextui-org/react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
            <Button
              color={'gradient'}
              css={{ mb: '$8' }}
              onPress={() => navigate('add')}
            >
              Добавить
            </Button>
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
