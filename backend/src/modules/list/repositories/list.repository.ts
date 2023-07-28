import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { List } from '../entities/list.entity';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';
import { getTsQueryFromString } from 'src/shared/libs/full-text-search/get-ts-query-from-string';

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
      const words = getTsQueryFromString(options.search);

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
    return await this.createQueryBuilder('list')
      .select([
        'list.id',
        'list.name',
        'list.description',
        'list.is_public',
        'list.created_at',
        'list.updated_at',
      ])
      .where('"list"."userId" = :userId', { userId })
      .andWhere('"list"."id" = :listId', { listId })
      .take(1)
      .getOne();
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
          image_url: true,
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

  async getPublicLists(search: string, limit: number, lowerBound: Date) {
    const { date, operator } = super.getRAWUpdatedAtCompareString(lowerBound);

    const plainQb = this.createQueryBuilder('list')
      .where('is_public = :isPublic', {
        isPublic: true,
      })
      .andWhere(`list.updated_at ${operator} :date`, { date })
      .take(limit + 1);

    if (search) {
      const words = getTsQueryFromString(search);

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

    // TODO can just left join users please? I don`t want to do two queries

    const listIds = lists.map((l) => l.id);

    const listsWithUsers = await this.createQueryBuilder('list')
      .leftJoin('list.user', 'usr')
      .select(['list.id', 'usr.id', 'usr.username', 'usr.image_url'])
      .where('list.id = ANY(:ids)', { ids: listIds })
      .getMany();

    // TODO because of two queries the result may be inconsistent: in that ms of delay the record in db can be changed
    const idUserMap = new Map(listsWithUsers.map(({ user, id }) => [id, user]));
    lists.forEach((l) => (l.user = idUserMap.get(l.id)));

    return super.processPagination(lists, limit, 'updated_at');
  }
}
