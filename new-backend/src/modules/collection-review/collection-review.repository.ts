import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateReviewProps, UpdateReviewProps } from './types';
import { Review, reviewSchema, selectReview } from './models/review';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { Collection } from 'src/modules/collection/models/collection';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import { Film } from 'src/modules/film/models/film';
import { getTsQueryFromString } from 'src/shared/utils/full-text-search/get-ts-query-from-string';

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

  async getReviewsFromCollection(
    id: Collection['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Review>> {
    const parsedKey = super.parseNextKey(nextKey);

    const reviews = await this.prismaService.review.findMany({
      where: {
        listId: id,
        createdAt: parsedKey ? { lte: new Date(parsedKey) } : undefined,
        deletedAt: null,
      },
      select: selectReview,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    });

    return super.getPaginatedData(reviews, limit, 'createdAt');
  }

  async searchReviewsFromCollection(
    collectionId: Collection['id'],
    search: string,
    limit: number,
  ): Promise<Review[]> {
    const searchString = getTsQueryFromString(search);

    const reviews = (await this.prismaService.$queryRaw`
    SELECT 
      review.id AS review_id,
      review.created_at AS review_created_at,
      review.updated_at AS review_updated_at,
      review.description AS review_description,
      review.score AS review_score,
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
    ORDER BY rank DESC
    LIMIT ${limit}
    `) as any[];

    return this.parseSearchReviews(reviews);
  }

  private parseSearchReviews(rawData: any[]): Review[] {
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
      } satisfies Review),
    );
  }
}
