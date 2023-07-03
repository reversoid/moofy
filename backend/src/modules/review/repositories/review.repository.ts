import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Film } from 'src/modules/film/entities/film.entity';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';

@Injectable()
export class ReviewRepository extends PaginatedRepository<Review> {
  constructor(private dataSource: DataSource) {
    super(Review, dataSource.createEntityManager());
  }

  /** Get existing user review on film */
  async getUserReviewOnFilm(filmId: string, userId: number) {
    return this.findOne({
      where: {
        film: {
          id: filmId,
        },
        user: {
          id: userId,
        },
      },
    });
  }

  /** Get all user reviews. Only info about film is **id** */
  async getAllUserReviews(userId: number, limit?: number, lowerBound?: Date) {
    const { date, operator } = super.getRAWUpdatedAtCompareString(lowerBound);

    const reviews = await this.createQueryBuilder('review')
      .select([
        'created_at',
        'updated_at',
        'description',
        'score',
        '"review"."filmId" "film_id"',
        '"review"."id"',
      ])
      .where(`review.user=${userId} `)
      .andWhere(`review.updated_at ${operator} :date`, {
        date,
      })
      .take(limit + 1)
      .orderBy('review.created_at', 'DESC')
      .execute();

    const modifiedReviews = reviews.map((review: any) =>
      this._wrapFilmProps(review),
    );

    return super.processPagination(modifiedReviews, limit, 'created_at');
  }

  /** Get all user reviews with full info about films. */
  async getAllUserReviewsWithFilms(
    userId: number,
    limit?: number,
    lowerBound?: Date,
  ) {
    const { date, operator } = super.getRAWUpdatedAtCompareString(lowerBound);
    const reviews = await this.createQueryBuilder('review')
      .select([
        'created_at',
        'updated_at',
        'description',
        'score',
        '"review"."id"',
      ])
      .leftJoinAndSelect('review.film', 'film')
      .where(`review.user=${userId} `)
      .andWhere(`review.updated_at ${operator} :date`, {
        date,
      })
      .take(limit + 1)
      .orderBy('review.created_at', 'DESC')
      .execute();

    const modifiedReviews = reviews.map((review: any) =>
      this._wrapFilmProps(review),
    );

    return super.processPagination(modifiedReviews, limit, 'created_at');
  }

  /** Get all reviews from public list with films*/
  async getReviewsFromPublicListWithFilms(
    listId: number,
    limit?: number,
    lowerBound?: Date,
  ) {
    const reviews = await this.find({
      where: {
        list: {
          id: listId,
          is_public: true,
        },
        created_at: super.getCompareOperator(lowerBound),
      },
      relations: {
        list: true,
        film: true,
      },
      select: {
        created_at: true,
        description: true,
        film: {
          filmLength: true,
          genres: true,
          id: true,
          name: true,
          posterPreviewUrl: true,
          posterUrl: true,
          reviews: true,
          type: true,
          year: true,
        },
        id: true,
        score: true,
        updated_at: true,
      },
      take: limit + 1,
      order: {
        created_at: 'DESC',
      },
    });
    reviews.forEach((r) => delete r.list);
    return super.processPagination(reviews, limit, 'created_at');
  }

  /** Get all reviews from list with films*/
  async getReviewsFromListWithFilmsForUser(
    listId: number,
    limit = 20,
    lowerBound?: Date,
  ) {
    const reviews = await this.find({
      where: {
        list: {
          id: listId,
        },
        created_at: super.getCompareOperator(lowerBound),
      },
      relations: {
        list: true,
        film: true,
      },
      select: {
        created_at: true,
        description: true,
        film: {
          filmLength: true,
          genres: true,
          id: true,
          name: true,
          posterPreviewUrl: true,
          posterUrl: true,
          reviews: true,
          type: true,
          year: true,
        },
        id: true,
        score: true,
        updated_at: true,
      },
      take: limit + 1,
      order: {
        created_at: 'DESC',
      },
    });
    reviews.forEach((r) => delete r.list);
    return super.processPagination(reviews, limit, 'created_at');
  }

  /**Returns review if user owns it, else returns undefined */
  async getUserReview(
    userId: number,
    reviewId: number,
  ): Promise<Review | undefined> {
    return await this.findOne({
      where: {
        id: reviewId,
        user: {
          id: userId,
        },
      },
    });
  }
  /** Get review, if it belong to user. Contains lists property */
  async getUserReviewWithListsProperty(userId: number, reviewId: number) {
    return this.findOne({
      where: {
        id: reviewId,
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
        score: true,
        description: true,
        created_at: true,
        updated_at: true,
      },
      relations: {
        list: true,
      },
    });
  }

  /** Wraps film properties into one film object*/
  private _wrapFilmProps(review: any) {
    const film = new Film();
    film.filmLength = review.film_filmLength;
    film.genres = review.film_genres;
    film.id = review.film_id;
    film.name = review.film_name;
    film.posterPreviewUrl = review.film_posterPreviewUrl;
    film.posterUrl = review.film_posterUrl;
    film.type = review.film_type;
    film.year = review.film_year;

    const modifiedReview = new Review();
    modifiedReview.created_at = review.created_at;
    modifiedReview.description = review.description;
    modifiedReview.film = film;
    modifiedReview.id = review.id;
    modifiedReview.score = review.score;
    modifiedReview.updated_at = review.updated_at;

    return modifiedReview;
  }
}
