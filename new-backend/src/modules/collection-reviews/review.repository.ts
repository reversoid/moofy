import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateReviewProps, UpdateReviewProps } from './types';
import { Review, selectReview } from './models/review';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

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
}
