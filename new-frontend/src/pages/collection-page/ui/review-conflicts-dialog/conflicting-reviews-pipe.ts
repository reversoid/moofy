import { Pipe, PipeTransform } from '@angular/core';
import { Film, Review } from '../../../../shared/types';

@Pipe({ name: 'conflictingReviews', standalone: true })
export class ConflictingReviewsPipe implements PipeTransform {
  transform(reviews: Review[]): { film: Film; reviews: Review[] }[] {
    const groups = this.groupReviews(reviews);

    // TODO remove mock
    return Array.from({ length: 5 }).map(() => ({
      film: {} as any,
      reviews: Array.from({ length: 5 }) as any,
    }));

    return Array.from(groups).map(([film, reviewsOnFilm]) => ({
      film,
      reviews: reviewsOnFilm,
    }));
  }

  private groupReviews(reviews: Review[]): Map<Film, Review[]> {
    const map = new Map<Film, Review[]>();

    for (const review of reviews) {
      const reviewsOnFilm = map.get(review.film);

      if (reviewsOnFilm) {
        map.set(review.film, [...reviewsOnFilm, review]);
      } else {
        map.set(review.film, [review]);
      }
    }

    return map;
  }
}
