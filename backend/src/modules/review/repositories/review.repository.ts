import { Injectable } from '@nestjs/common';
import { DataSource, Raw } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Film } from 'src/modules/film/entities/film.entity';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';
import { getTsQueryFromString } from 'src/shared/libs/full-text-search/get-ts-query-from-string';
import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';
import { List } from 'src/modules/list/entities/list.entity';

export function SearchMatch(search: string) {
  return Raw(
    (columnAlias: string) =>
      `("Review__Review_film"."search_document" || ${columnAlias}) @@ plainto_tsquery(:search_string)`,
    {
      search_string: search,
    },
  );
}

@Injectable()
export class ReviewRepository extends PaginatedRepository<Review> {
  constructor(dataSource: DataSource) {
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
    const { date, operator } = super.getRAWDatesCompareString(lowerBound);

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
    const { date, operator } = super.getRAWDatesCompareString(lowerBound);
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
    options: {
      limit?: number;
      lowerBound?: Date;
      search?: string;
    },
  ) {
    const limit = options.limit ?? 20;

    const { date, operator } = super.getRAWDatesCompareString(
      options.lowerBound,
    );
    const plainQb = this.createQueryBuilder('review')
      .leftJoinAndSelect('review.list', 'list')
      .leftJoinAndSelect('review.film', 'film')
      .select([
        'review.created_at',
        'review.description',
        'review.id',
        'review.score',
        'review.updated_at',
        'film.filmLength',
        'film.genres',
        'film.id',
        'film.name',
        'film.posterPreviewUrl',
        'film.posterUrl',
        'film.type',
        'film.year',
      ])
      .where('list.id = :listId', { listId })
      .andWhere(`review.created_at ${operator} :date`, { date })
      .take(options.limit + 1);

    if (options.search) {
      const words = getTsQueryFromString(options.search);

      plainQb
        .addSelect(
          `ts_rank(film.search_document || review.search_document, to_tsquery('simple', :search_string))`,
          'rank',
        )
        .andWhere(
          `(film.search_document || review.search_document) @@ to_tsquery('simple', :search_string)`,
          { search_string: words },
        )
        .orderBy('rank', 'DESC');
    }

    plainQb.addOrderBy('review.created_at', 'DESC');

    const reviews = await plainQb.getMany();
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

  async getRandomReviews(
    listId: number,
    limit: number,
    type: 'all' | 'ranked' | 'unranked',
    ignoreIds?: number[],
  ) {
    const query = this.createQueryBuilder('review')
      .leftJoinAndSelect('review.list', 'list')
      .leftJoinAndSelect('review.film', 'film')
      .select([
        'review.created_at',
        'review.description',
        'review.id',
        'review.score',
        'review.updated_at',
        'film.filmLength',
        'film.genres',
        'film.id',
        'film.name',
        'film.posterPreviewUrl',
        'film.posterUrl',
        'film.type',
        'film.year',
      ])
      .addSelect('RANDOM()', 'rand')
      .orderBy('rand')
      .where('list.id = :listId', { listId })
      .take(limit);

    if (ignoreIds && ignoreIds.length > 0) {
      query.andWhere('review.id NOT IN(:...ignoreIds)', { ignoreIds });
    }

    if (type === 'unranked') {
      query.andWhere('review.score is NULL');
    }
    if (type === 'ranked') {
      query.andWhere('review.score is NOT NULL');
    }

    return query.getMany();
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

  async getUserPublicReviews(
    userId: number,
    limit: number,
    lowerBound?: Date,
  ): Promise<IterableResponse<{ review: Review; list: List }>> {
    const { date, operator } = super.getRAWDatesCompareString(lowerBound);

    const reviews = await this.createQueryBuilder('review')
      .select(['review'])
      .addSelect('review.list')
      .leftJoinAndSelect('review.list', 'list')
      .leftJoinAndSelect('review.film', 'film')
      .where('review.userId = :userId', { userId })
      .andWhere('list.is_public = TRUE')
      .andWhere('review.score IS NOT NULL')
      .andWhere('review.description IS NOT NULL')
      .andWhere("review.description <> ''")
      .andWhere(`list.updated_at ${operator} :date`, { date })
      .take(limit + 1)
      .orderBy('review.updated_at', 'DESC')
      .getMany();

    const paginatedResult = super.processPagination(
      reviews,
      limit,
      'updated_at',
    );

    const result: IterableResponse<{ review: Review; list: List }> = {
      items: paginatedResult.items.map((review) => {
        const list = review.list;
        delete review.list;
        return { list, review: review };
      }),
      nextKey: paginatedResult.nextKey,
    };

    return result;
  }

  async getPublicReviewsAmount(userId: number): Promise<number> {
    return this.createQueryBuilder('review')
      .leftJoinAndSelect(List, 'list', 'review.listId = list.id')
      .select(['review.id'])
      .where('review.userId = :userId', { userId })
      .andWhere('review.score IS NOT NULL')
      .andWhere('review.description IS NOT NULL')
      .andWhere("review.description <> ''")
      .andWhere('list.is_public = TRUE')
      .getCount();
  }
}
