import { Injectable } from '@nestjs/common';
import { CreateReviewProps, UpdateReviewProps } from './types';
import { CollectionReviewRepository } from './repositories/collection-review.repository';
import { Review } from './models/review';
import { Collection } from '../collection/models/collection';
import { FilmService } from '../film/film.service';
import { WrongFilmIdException } from '../film/exceptions/wrong-film-id.exception';
import { ReviewOnFilmExists } from './exceptions/review-exists.exception';
import { Film } from '../film/models/film';

@Injectable()
export class CollectionReviewService {
  constructor(
    private readonly reviewRepository: CollectionReviewRepository,
    private readonly filmService: FilmService,
  ) {}

  async createReview(props: CreateReviewProps) {
    await this.validateReviewExistence(props.listId, props.filmId);
    await this.ensureFilmExists(props.filmId);

    return this.reviewRepository.createReview(props);
  }

  async getReviewById(id: Review['id']) {
    return this.reviewRepository.getReviewById(id);
  }

  async updateReview(props: UpdateReviewProps) {
    return this.reviewRepository.updateReview(props);
  }

  async deleteReview(id: Review['id']) {
    return this.reviewRepository.deleteReview(id);
  }

  async getReviews(
    collectionId: Collection['id'],
    limit: number,
    nextKey?: string,
  ) {
    return this.reviewRepository.getReviewsFromCollection(
      collectionId,
      limit,
      nextKey,
    );
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
