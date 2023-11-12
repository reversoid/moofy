import { Film } from '@/shared/api/types/film.type';
import { Card } from '@/shared/ui/Card';
import { FC } from 'react';
import ReviewImageWithScore from './review-image-with-score';
import { FilmNameWithYear } from './film-name-with-year';

export interface ReviewFilmProps {
  score: number | null;
  film: Film;
}

export const ReviewFilm: FC<ReviewFilmProps> = ({ film, score }) => {
  return (
    <Card vertical css={{ margin: 0 }}>
      <ReviewImageWithScore
        centered
        imgSrc={film.posterPreviewUrl}
        score={score}
      />
      <FilmNameWithYear
        centered
        id={film.id}
        name={film.name}
        year={film.year}
      />
    </Card>
  );
};
