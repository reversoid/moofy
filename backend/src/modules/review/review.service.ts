import { HttpException, Injectable } from '@nestjs/common';
import { ReviewErrors } from 'src/errors/review.errors';
import { FilmService } from '../film/film.service';
import { FilmRepository } from '../film/repositories/film.repository';
import { ListRepository } from '../list/repositories/list.repository';
import { User } from '../user/entities/user.entity';
import { CreateReviewDTO } from './dtos/createReview.dto';
import { UpdateReviewDTO } from './dtos/updateReview.dto';
import { ReviewRepository } from './repositories/review.repository';
import { sanitizeHtml } from '../../shared/libs/sanitizeHtml/sanitizeHtml';
import { List } from '../list/entities/list.entity';
import { Review } from './entities/review.entity';
import { ListService } from '../list/list.service';
import { ListErrors } from 'src/errors/list.errors';
import { GetRandomReviewType } from './dtos/get-random-review.dto';

export const ORDER_INITIAL_VALUE = 1984;
export const ORDER_INCREMENT_VALUE = 8;

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly listRepository: ListRepository,
    private readonly filmRepository: FilmRepository,
    private readonly listService: ListService,

    private readonly filmService: FilmService,
  ) {}

  async createReview(
    user: User,
    { listId, score, filmId, description, tags }: CreateReviewDTO,
  ): Promise<{ list: List; review: Review }> {
    const list = await this.listRepository.getUserList(listId, user.id);

    if (!list) {
      throw new HttpException(ReviewErrors.INVALID_LIST_ID, 400);
    }

    const reviewOnFilmAlreadyExists = await this.reviewRepository.findOne({
      where: {
        film: {
          id: filmId,
        },
        list: {
          id: listId,
        },
      },
    });

    if (reviewOnFilmAlreadyExists) {
      throw new HttpException(ReviewErrors.REVIEW_FOR_FILM_ALREADY_EXISTS, 400);
    }

    let existingFilm = await this.filmRepository.getFilmById(filmId);

    if (!existingFilm) {
      existingFilm = await this.filmService.saveFilmById(filmId);
    }

    const { maxOrder }: { maxOrder: string | null } =
      await this.reviewRepository
        .createQueryBuilder('review')
        .select('MAX(review.order_in_list)', 'maxOrder')
        .where('review.list = :listId', { listId })
        .andWhere('review.deleted_at is NULL')
        .getRawOne();

    const orderInList =
      maxOrder === null
        ? ORDER_INITIAL_VALUE
        : Number(maxOrder) + ORDER_INCREMENT_VALUE;

    const review = this.reviewRepository.create({
      film: existingFilm,
      user,
      score: score ?? null,
      description: description?.trim() ? sanitizeHtml(description) : undefined,
      list,
      tags,
      order_in_list: orderInList,
    });

    const resultReview = await this.reviewRepository.save(review);
    const resultList = await this.listRepository.save({
      ...list,
      updated_at: new Date(),
    });
    delete review.list;
    return {
      review: resultReview,
      list: {
        ...resultList,
        user: { id: user.id, username: user.username } as User,
      },
    };
  }

  async getReviews(
    user: User,
    limit: number,
    includeFilms?: boolean,
    lowerBound?: Date,
  ) {
    if (includeFilms) {
      return this.reviewRepository.getAllUserReviewsWithFilms(
        user.id,
        limit,
        lowerBound,
      );
    }
    return this.reviewRepository.getAllUserReviews(user.id, limit, lowerBound);
  }

  async getReviewsWithFilms(user: User, limit: number, lowerBound?: Date) {
    return this.reviewRepository.getAllUserReviewsWithFilms(
      user.id,
      limit,
      lowerBound,
    );
  }

  async getReviewsFromPublicList(
    listId: number,
    limit: number,
    lowerBound?: Date,
  ) {
    return this.reviewRepository.getReviewsFromPublicListWithFilms(
      listId,
      limit,
      lowerBound,
    );
  }

  async getReviewsFromListWithFilms(
    user: User | undefined,
    listId: number,
    options?: {
      search?: string;
      limit?: number;
      lowerBound?: Date;
    },
  ) {
    const list = await this.listService.getListById(listId);

    if (!list) {
      throw new HttpException(ListErrors.WRONG_LIST_ID, 400);
    }

    if (list.is_public === false) {
      const guestVisitsPrivateCollection = user === undefined;
      if (guestVisitsPrivateCollection) {
        throw new HttpException(ListErrors.NOT_ALLOWED, 403);
      }

      const userVisitsNotOwnedCollection = user.id !== list.user.id;
      if (userVisitsNotOwnedCollection) {
        throw new HttpException(ListErrors.NOT_ALLOWED, 403);
      }
    }

    const [[listWithInfo], reviews] = await Promise.all([
      this.listService.getListsWithAdditionalInfo([list], user?.id),
      this.reviewRepository.getReviewsFromListWithFilmsForUser(listId, {
        ...options,
        search: options.search,
      }),
    ]);

    return {
      ...listWithInfo,
      reviews,
    };
  }

  async updateReview(
    user: User,
    { reviewId, description, score, tags }: UpdateReviewDTO,
  ): Promise<{ review: Review; list: List }> {
    const review = await this.reviewRepository.getUserReviewWithListsProperty(
      user.id,
      reviewId,
    );
    if (!review) {
      throw new HttpException(ReviewErrors.INVALID_REVIEW_ID, 400);
    }

    const listResult = await this.listRepository.save({
      ...review.list,
      updated_at: new Date(),
    });

    if (description === undefined && score === undefined && tags.length !== 0) {
      delete review.list;
      return {
        review,
        list: {
          ...listResult,
          user: { id: user.id, username: user.username } as User,
        },
      };
    }
    if (description !== undefined) {
      review.description = sanitizeHtml(description);
    }
    if (score !== undefined) {
      review.score = score;
    }
    if (tags !== undefined) {
      review.tags = tags;
    }

    const reviewResult = await this.reviewRepository.save(review);
    delete review.list;
    return {
      list: {
        ...listResult,
        user: { id: user.id, username: user.username } as User,
      },
      review: reviewResult,
    };
  }

  async deleteReview(user: User, reviewId: number) {
    const review = await this.reviewRepository.getUserReviewWithListsProperty(
      user.id,
      reviewId,
    );
    if (!review) {
      return {
        reviewId,
      };
    }

    await this.reviewRepository.softDelete({
      id: reviewId,
    });

    const updatedList = await this.listRepository.save({
      ...review.list,
      updated_at: new Date(),
    });

    return {
      reviewId,
      list: {
        ...updatedList,
        user: { id: user.id, username: user.username } as User,
      },
    };
  }

  async getRandomReviews(
    listId: number,
    limit: number,
    type: GetRandomReviewType,
    ignoreIds?: number[],
  ) {
    const randomType =
      type === GetRandomReviewType.ALL
        ? 'all'
        : type === GetRandomReviewType.RANKED
        ? 'ranked'
        : type === GetRandomReviewType.UNRANKED
        ? 'unranked'
        : 'all';

    return this.reviewRepository.getRandomReviews(
      listId,
      limit,
      randomType,
      ignoreIds,
    );
  }
}
