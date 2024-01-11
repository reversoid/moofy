import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateReviewProps, UpdateReviewProps } from './types';
import { Review, reviewSchema, selectReview } from '../models/review';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { Collection } from 'src/modules/collection/models/collection';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import { Film } from 'src/modules/film/models/film';
import { getTsQueryFromString } from 'src/shared/utils/full-text-search/get-ts-query-from-string';
import { Prisma } from '@prisma/client';

@Injectable()
export class CollectionReviewRepository extends PaginatedRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async createReview({
    description,
    filmId,
    score,
    collectionId: listId,
    userId,
  }: CreateReviewProps): Promise<Review> {
    return this.prismaService.review.create({
      data: { description, filmId, score, listId, userId },
      select: selectReview,
    });
  }

  async getReviewById(id: Review['id']): Promise<Review | null> {
    return this.prismaService.review.findUnique({
      where: { id, deletedAt: null },
      select: selectReview,
    });
  }

  async hideReviews(reviewsIds: Array<Review['id']>): Promise<void> {
    await this.prismaService.review.updateMany({
      where: { deletedAt: null, id: { in: reviewsIds }, isHidden: false },
      data: { isHidden: true },
    });
  }

  async makeReviewsVisible(reviewsIds: Array<Review['id']>): Promise<void> {
    await this.prismaService.review.updateMany({
      where: { deletedAt: null, id: { in: reviewsIds }, isHidden: true },
      data: { isHidden: false },
    });
  }

  async getConflictingReviews(
    collectionId: Collection['id'],
  ): Promise<Review[]> {
    const rawReviews = (await this.prismaService.$queryRaw`
      SELECT 
        review.id AS review_id,
        review.created_at AS review_created_at,
        review.updated_at AS review_updated_at,
        review.description AS review_description,
        review.score AS review_score,
        review.is_hidden as is_hidden,
        film.id AS film_id,
        film.genres AS film_genres,
        film.name AS film_name,
        film.poster_preview_url AS film_poster_preview_url,
        film.poster_url AS film_poster_url,
        film.type AS film_type,
        film.year AS film_year
      FROM review
      JOIN film ON film.id = review.film_id
      JOIN (
        SELECT film_id
        FROM review
        WHERE review.list_id = ${collectionId} AND review.deleted_at IS NULL
        GROUP BY film_id
        HAVING COUNT(*) > 1
      ) r ON review.film_id = r.film_id
      WHERE review.deleted_at IS NULL
        AND review.list_id = ${collectionId}`) as any[];

    return this.parseRawReviews(rawReviews);
  }

  async getRandomReview(
    collectionId: Collection['id'],
    ignoreIds?: Array<Review['id']>,
  ): Promise<Review | null> {
    const ignoreCondition = ignoreIds?.length
      ? `AND review.id NOT IN(${ignoreIds.join()})`
      : '';

    const rawReviews = (await this.prismaService.$queryRaw`
      SELECT 
        review.id AS review_id,
        review.created_at AS review_created_at,
        review.updated_at AS review_updated_at,
        review.description AS review_description,
        review.score AS review_score,
        review.is_hidden AS is_hidden,
        film.id AS film_id,
        film.genres AS film_genres,
        film.name AS film_name,
        film.poster_preview_url AS film_poster_preview_url,
        film.poster_url AS film_poster_url,
        film.type AS film_type,
        film.year AS film_year,
        RANDOM() as random
      FROM review
      JOIN film ON film.id = review.film_id
      WHERE review.deleted_at IS NULL
        AND review.list_id = ${collectionId}
        ${Prisma.raw(ignoreCondition)}
      ORDER BY random
      LIMIT 1`) as any[];

    const reviews = this.parseRawReviews(rawReviews);
    return reviews.at(0) ?? null;
  }

  async reviewOnFilmExists(
    collectionId: Collection['id'],
    filmId: Film['id'],
  ): Promise<boolean> {
    const review = await this.prismaService.review.findFirst({
      where: { deletedAt: null, listId: collectionId, filmId },
    });
    return Boolean(review);
  }

  async updateReview({
    description,
    id,
    score,
  }: UpdateReviewProps): Promise<Review> {
    return this.prismaService.review.update({
      data: { description, score },
      where: { id },
      select: selectReview,
    });
  }

  async deleteReview(id: Review['id']): Promise<{ id: Review['id'] }> {
    await this.prismaService.review.update({
      data: { deletedAt: new Date() },
      where: { id },
    });
    return { id };
  }

  async isReviewBelongsToCollection(
    reviewId: Review['id'],
    collectionId: Collection['id'],
  ): Promise<boolean> {
    return Boolean(
      await this.prismaService.review.findFirst({
        where: {
          id: reviewId,
          listId: collectionId,
          deletedAt: null,
        },
      }),
    );
  }

  async moveReviewsToAnotherCollection(
    fromCollectionsIds: Array<Collection['id']>,
    toCollectionId: Collection['id'],
    moveOptions: { withScore?: boolean; withDescription?: boolean },
  ): Promise<void> {
    await this.prismaService.review.updateMany({
      where: {
        listId: { in: fromCollectionsIds },
        description:
          moveOptions.withDescription === true
            ? { not: null }
            : moveOptions.withDescription === false
              ? null
              : undefined,
        score:
          moveOptions.withScore === true
            ? { not: null }
            : moveOptions.withScore === false
              ? null
              : undefined,
      },
      data: {
        listId: toCollectionId,
      },
    });
  }

  async copyReviewsToAnotherCollection(
    fromCollectionsIds: Array<Collection['id']>,
    toCollectionId: Collection['id'],
    copyOptions: { withScore?: boolean; withDescription?: boolean },
  ): Promise<void> {
    const inQuery = Prisma.raw(`IN (${fromCollectionsIds.join(', ')})`);

    const optionsQueryParts = [];
    if (copyOptions.withScore) {
      optionsQueryParts.push('score IS NOT NULL');
    } else if (copyOptions.withScore === false) {
      optionsQueryParts.push('score IS NULL');
    }

    if (copyOptions.withDescription) {
      optionsQueryParts.push('description IS NOT NULL');
    } else if (copyOptions.withScore === false) {
      optionsQueryParts.push('description IS NULL');
    }

    const optionsQuery =
      optionsQueryParts.length > 0
        ? Prisma.raw('AND ' + optionsQueryParts.join(' AND '))
        : Prisma.raw('');

    await this.prismaService.$executeRaw`
      INSERT INTO review (score, description, tags, film_id, user_id, list_id, is_hidden)
      SELECT score, description, tags, film_id, user_id, ${toCollectionId}, is_hidden
      FROM review
      WHERE list_id ${inQuery}
      ${optionsQuery}
    `;
  }

  async getReviewsFromCollection(
    id: Collection['id'],
    type: 'all' | 'hidden' | 'visible',
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Review>> {
    const parsedKey = super.parseNextKey(nextKey);

    const reviews = await this.prismaService.review.findMany({
      where: {
        listId: id,
        createdAt: parsedKey ? { lte: new Date(parsedKey) } : undefined,
        deletedAt: null,
        isHidden: type === 'all' ? undefined : type === 'hidden' ? true : false,
      },
      select: selectReview,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    });

    return super.getPaginatedData(reviews, limit, 'createdAt');
  }

  async searchReviewsFromCollection(
    collectionId: Collection['id'],
    type: 'all' | 'hidden' | 'visible',
    search: string,
    limit: number,
  ): Promise<Review[]> {
    const searchString = getTsQueryFromString(search);

    const whereHiddenExpression = Prisma.raw(
      type === 'all'
        ? ''
        : type === 'hidden'
          ? 'AND review.is_hidden = TRUE'
          : 'AND review.is_hidden = FALSE',
    );

    const reviews = (await this.prismaService.$queryRaw`
    SELECT 
      review.id AS review_id,
      review.created_at AS review_created_at,
      review.updated_at AS review_updated_at,
      review.description AS review_description,
      review.score AS review_score,
      review.is_hidden AS is_hidden,
      film.id AS film_id,
      film.genres AS film_genres,
      film.name AS film_name,
      film.poster_preview_url AS film_poster_preview_url,
      film.poster_url AS film_poster_url,
      film.type AS film_type,
      film.year AS film_year,
      ts_rank(film_metadata.search_document || review_metadata.search_document, to_tsquery('simple', ${searchString})) AS rank
    FROM review
    JOIN review_metadata ON review_metadata.review_id = review.id
    JOIN film ON film.id = review.film_id
    JOIN film_metadata ON film_metadata.film_id = film.id
    WHERE review.list_id = ${collectionId} 
      AND (film_metadata.search_document || review_metadata.search_document) @@ to_tsquery('simple', ${searchString})
      AND review.deleted_at IS NULL
      ${whereHiddenExpression}
    ORDER BY rank DESC
    LIMIT ${limit}
    `) as any[];

    return this.parseRawReviews(reviews);
  }

  private parseRawReviews(rawData: any[]): Review[] {
    return rawData.map<Review>((data) =>
      reviewSchema.parse({
        id: data.review_id,
        createdAt: data.review_created_at,
        updatedAt: data.review_updated_at,
        description: data.review_description,
        film: {
          id: data.film_id,
          genres: data.film_genres,
          name: data.film_name,
          posterPreviewUrl: data.film_poster_preview_url,
          posterUrl: data.film_poster_url,
          type: data.film_type,
          year: data.film_year,
        },
        score: data.review_score,
        isHidden: data.is_hidden,
      } satisfies Review),
    );
  }
}
