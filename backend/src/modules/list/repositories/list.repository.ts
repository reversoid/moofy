import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { List } from '../entities/list.entity';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';

@Injectable()
export class ListRepository extends PaginatedRepository<List> {
  constructor(private dataSource: DataSource) {
    super(List, dataSource.createEntityManager());
  }

  /** Get user lists */
  async getUserLists(
    userId: number,
    limit: number,
    isPublic?: boolean,
    lowerBound?: Date,
  ) {
    const lists = await this.find({
      where: {
        user: {
          id: userId,
        },
        is_public: isPublic,
        updated_at: super.getCompareOperator(lowerBound),
      },
      take: limit + 1,
      order: {
        updated_at: 'DESC',
      },
    });

    return super.processPagination(lists, limit, 'updated_at');
  }

  /**Returns list if user owns it, else returns undefined */
  async getUserList(listId: number, userId: number): Promise<List | undefined> {
    return (
      await this.createQueryBuilder('list')
        .select([
          'id',
          'name',
          'description',
          'is_public',
          'created_at',
          'updated_at',
        ])
        .where('"list"."userId" = :userId', { userId })
        .andWhere('"list"."id" = :listId', { listId })
        .take(1)
        .execute()
    )[0];
  }

  async getListById(listId: number): Promise<List | undefined> {
    return this.findOne({
      where: {
        id: listId,
      },
      relations: {
        user: true,
      },
      select: {
        created_at: true,
        description: true,
        id: true,
        image_url: true,
        is_public: true,
        name: true,
        user: {
          id: true,
          username: true,
        },
        updated_at: true,
      },
    });
  }

  async getAmountOfUserLists(userId: number, isPublic?: boolean) {
    return this.count({
      where: {
        user: {
          id: userId,
        },
        is_public: isPublic,
      },
    });
  }
}
