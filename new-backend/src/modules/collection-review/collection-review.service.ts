import { Injectable } from '@nestjs/common';
import { CreateReviewProps, UpdateReviewProps } from './types';
import { CollectionReviewRepository } from './collection-review.repository';
import { Review } from './models/review';
import { Collection } from '../collection/models/collection';
import { FilmService } from '../film/film.service';
import { WrongFilmIdException } from '../film/exceptions/wrong-film-id.exception';
import { ReviewOnFilmExists } from './exceptions/review-exists.exception';
import { Film } from '../film/models/film';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';

@Injectable()
export class CollectionReviewService {
  constructor(
    private readonly reviewRepository: CollectionReviewRepository,
    private readonly filmService: FilmService,
  ) {}

  async createReview(props: CreateReviewProps) {
    await this.validateReviewExistence(props.collectionId, props.filmId);
    await this.ensureFilmExists(props.filmId);

    return this.reviewRepository.createReview(props);
  }

  async getConflictingReviews(
    collectionId: Collection['id'],
  ): Promise<Review[]> {
    return this.reviewRepository.getConflictingReviews(collectionId);
  }

  async resolveConflictingReviews(
    collectionId: Collection['id'],
    reviewsIdsToSave: Set<Review['id']>,
  ): Promise<void> {
    const conflictReviews = await this.getConflictingReviews(collectionId);

    for (const conflictReview of conflictReviews) {
      if (!reviewsIdsToSave.has(conflictReview.id)) {
        reviewsIdsToSave.delete(conflictReview.id);
      }
    }

    await this.reviewRepository.makeReviewsVisible(
      Array.from(reviewsIdsToSave),
    );

    const conflictGroups = this.groupConflictReviews(conflictReviews);

    for (const [, reviewsIds] of conflictGroups) {
      for (const id of reviewsIds) {
        if (!reviewsIdsToSave.has(id)) {
          await this.deleteReview(id);
        }
      }
    }
  }

  private groupConflictReviews(reviews: Review[]) {
    const result: Map<Film['id'], Set<Review['id']>> = new Map();

    for (const review of reviews) {
      const hasFilm = result.has(review.film.id);
      if (hasFilm) {
        result.get(review.film.id)?.add(review.id);
      } else {
        result.set(review.film.id, new Set([review.id]));
      }
    }

    return result;
  }

  async hideReviews(reviewsIds: Array<Review['id']>): Promise<void> {
    await this.reviewRepository.hideReviews(reviewsIds);
  }

  async getReviewById(id: Review['id']) {
    return this.reviewRepository.getReviewById(id);
  }

  async updateReview(props: UpdateReviewProps) {
    return this.reviewRepository.updateReview(props);
  }

  async deleteReview(id: Review['id']) {
    await this.reviewRepository.deleteReview(id);
  }

  async moveAllReviewsToAnotherCollection(
    fromCollectionsIds: Array<Collection['id']>,
    toCollectionId: Collection['id'],
  ): Promise<void> {
    return this.reviewRepository.moveAllReviewsToAnotherCollection(
      fromCollectionsIds,
      toCollectionId,
    );
  }

  // TODO maybe make 2 methods?
  async getReviews(
    collectionId: Collection['id'],
    type: 'all' | 'hidden' | 'visible',
    search: string | null,
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Review>> {
    if (search) {
      const reviews = await this.reviewRepository.searchReviewsFromCollection(
        collectionId,
        type,
        search,
        limit,
      );
      return { items: reviews, nextKey: null };
    }

    return this.reviewRepository.getReviewsFromCollection(
      collectionId,
      type,
      limit,
      nextKey,
    );
  }

  async getRandomReview(
    collectionId: Collection['id'],
    ignoreIds: Array<Review['id']> = [],
  ): Promise<Review | null> {
    return this.reviewRepository.getRandomReview(collectionId, ignoreIds);
  }

  private async validateReviewExistence(
    collectionId: Collection['id'],
    filmId: Film['id'],
  ) {
    const reviewOnFilmExists = await this.reviewRepository.reviewOnFilmExists(
      collectionId,
      filmId,
    );
    if (reviewOnFilmExists) {
      throw new ReviewOnFilmExists();
    }
  }

  private async ensureFilmExists(filmId: Film['id']) {
    const film = await this.filmService.getFilmById(filmId);

    if (!film) {
      throw new WrongFilmIdException();
    }
    try {
      await this.filmService.saveFilm(film);
    } catch (error: unknown) {
      // film is saved
    }
  }
}
