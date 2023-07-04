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
    options?: {
      isPublic?: boolean;
      lowerBound?: Date;
      search?: string;
    },
  ) {
    const { date, operator } = super.getRAWUpdatedAtCompareString(
      options?.lowerBound,
    );
    const plainQb = this.createQueryBuilder('list')
      .where('list.user = :userId', { userId })
      .andWhere(`list.updated_at ${operator} :date`, { date })
      .take(limit + 1);

    if (options?.isPublic !== undefined) {
      plainQb.andWhere('is_public = :isPublic', {
        isPublic: options?.isPublic,
      });
    }

    if (options?.search) {
      const words = options.search
        .split(' ')
        .map((c) => c.trim())
        .filter(Boolean)
        .map((word) => `${word}:*`)
        .join(' & ');

      plainQb
        .addSelect(
          `ts_rank(list.search_document, to_tsquery('simple', :search_string))`,
          'rank',
        )
        .andWhere(
          `(list.search_document) @@ to_tsquery('simple', :search_string)`,
          {
            search_string: words,
          },
        )
        .orderBy('rank', 'DESC');
    }

    plainQb.addOrderBy('updated_at', 'DESC');

    const lists = await plainQb.getMany();

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
