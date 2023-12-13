import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateReviewProps, UpdateReviewProps } from './types';
import { Review, selectReview } from './models/review';
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

    const reviews = await this.prismaService.$queryRaw`
    SELECT * FROM review,
    ts_rank(film_metadata.search_document || review_metadata.search_document, to_tsquery('simple', ${searchString})) AS rank
    WHERE review.listId = ${collectionId} AND (film_metadata.search_document || review.search_document) @@ to_tsquery('simple', ${searchString})
    JOIN review_metadata ON review_metadata.reviewId = review.id
    JOIN film ON film.id = review.filmId
    JOIN film_metadata ON film.metadata.filmId = film.id
    ORDER BY rank DESC
    LIMIT ${limit}
    `;

    // TODO parse reviews
    return reviews as any;
  }
}
