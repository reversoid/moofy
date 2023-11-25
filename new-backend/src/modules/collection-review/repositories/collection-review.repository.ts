import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateReviewProps, UpdateReviewProps } from '../types';
import { Review, selectReview } from '../models/review';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { Collection } from 'src/modules/collection/models/collection';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';

@Injectable()
export class CollectionReviewRepository extends PaginatedRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async createReview({
    description,
    filmId,
    score,
    listId,
    userId,
  }: CreateReviewProps): Promise<Review> {
    return this.prismaService.review.create({
      data: { description, filmId, score, listId, userId },
      select: selectReview,
    });
  }

  async getReviewById(id: Review['id']): Promise<Review | null> {
    return this.prismaService.review.findUnique({
      where: { id },
      select: selectReview,
    });
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
      data: { deleted_at: new Date() },
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
        created_at: parsedKey ? { lte: new Date(parsedKey) } : undefined,
      },
      select: selectReview,
      orderBy: { created_at: 'desc' },
      take: limit + 1,
    });

    return super.getPaginatedData(reviews, limit, 'created_at');
  }
}
