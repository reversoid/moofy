import { Injectable } from '@nestjs/common';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { PersonalReview, selectPersonalReview } from './models/personal-review';
import { User } from '../user/models/user';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { Film } from '../film/models/film';

const isHiddenByType = {
  all: undefined,
  hidden: true,
  visible: false,
};

@Injectable()
export class PersonalReviewRepository extends PaginatedRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async getUserPersonalReviews(
    userId: User['id'],
    limit: number,
    type: 'all' | 'hidden' | 'visible',
    nextKey?: string,
  ): Promise<PaginatedData<PersonalReview>> {
    const key = super.parseNextKey(nextKey);

    const data = await this.prismaService.personalReview.findMany({
      select: selectPersonalReview,
      where: {
        deletedAt: null,
        updatedAt: key ? { lte: new Date(key) } : undefined,
        userId: userId,
        isHidden: isHiddenByType[type],
      },
      take: limit + 1,
    });

    return super.getPaginatedData(data, limit, 'updatedAt');
  }

  async createPersonalReview(
    userId: User['id'],
    filmId: Film['id'],
    text?: string,
    score?: number,
  ): Promise<PersonalReview> {
    const data = await this.prismaService.personalReview.create({
      data: { userId, description: text, score, filmId },
      select: selectPersonalReview,
    });
    return data;
  }

  async updatePersonalReview(
    id: PersonalReview['id'],
    description?: string | null,
    score?: number | null,
  ): Promise<PersonalReview> {
    const data = await this.prismaService.personalReview.update({
      where: { id },
      data: { description, score },
      select: selectPersonalReview,
    });
    return data;
  }

  async getPersonalReview(
    id: PersonalReview['id'],
  ): Promise<PersonalReview | null> {
    const data = await this.prismaService.personalReview.findUnique({
      where: { id, deletedAt: null },
      select: selectPersonalReview,
    });
    return data;
  }

  async getPersonalReviewAmount(userId: User['id']): Promise<number> {
    return this.prismaService.personalReview.count({
      where: { userId, deletedAt: null, isHidden: false },
    });
  }

  async deletePersonalReview(
    id: PersonalReview['id'],
  ): Promise<{ id: PersonalReview['id'] }> {
    await this.prismaService.personalReview.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { id };
  }
}
