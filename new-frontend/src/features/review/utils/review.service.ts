import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateReviewProps } from './types';
import { Review } from '../../../shared/types';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private readonly http: HttpClient) {}

  createReview({
    collectionId,
    description,
    score,
    filmId,
  }: CreateReviewProps): Observable<Review> {
    return this.http
      .post<{ review: Review }>(`collections/${collectionId}/reviews`, {
        description,
        score,
        filmId,
      })
      .pipe(map((d) => d.review));
  }

  getReview() {}

  editReview() {}

  deleteReview() {}
}
