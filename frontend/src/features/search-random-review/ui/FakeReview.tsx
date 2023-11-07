import { FilmType } from '@/shared/api/types/film.type';
import { ReviewItem } from '../../../entities/Review/ui/Review/ReviewItem';
import { Question } from '../../../shared/Icons/Question.icon';

const FakeReview: React.FC = () => {
  return (
    <>
      <Question
        style={{
          width: '4rem',
          height: '4rem',
          position: 'absolute',
          top: '5rem',
          zIndex: 1000,
          fill: 'green',
        }}
      />
      <ReviewItem
        review={{
          film: {
            name: '',
            year: 0,
            id: '',
            genres: [],
            type: FilmType.FILM,
            filmLength: '',
            posterUrl: '',
            posterPreviewUrl: '',
          },
          description: '',
          score: null,
          id: -666,
          created_at: new Date(),
          updated_at: new Date(),
        }}
        horizontal={false}
      />
    </>
  );
};

export default FakeReview;
