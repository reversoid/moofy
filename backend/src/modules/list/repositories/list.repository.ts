import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { List } from '../entities/list.entity';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';
import { getTsQueryFromString } from 'src/shared/libs/full-text-search/get-ts-query-from-string';
import { AdditionalListInfo } from 'src/modules/review/review.controller';
import { Order } from '../dtos/get-updates.query.dto';
import { Subscription } from 'src/modules/user/entities/subscription.entity';
import { ListView } from '../entities/list-view.entity';

@Injectable()
export class ListRepository extends PaginatedRepository<List> {
  constructor(dataSource: DataSource) {
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
    const { date, operator } = super.getRAWDatesCompareString(
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
    const { date, operator } = super.getRAWDatesCompareString(lowerBound);

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

  async getListStatistics(
    listId: number,
    userId?: number,
  ): Promise<
    Omit<
      AdditionalListInfo,
      'isFavorite' | 'isViewed' | 'isUpdatedSinceLastView'
    >
  > {
    const query = this.createQueryBuilder('list')
      .select('list.id', 'id')
      .addSelect('COUNT(DISTINCT like.id)', 'likesCount')
      .addSelect('COUNT(DISTINCT comment.id)', 'commentsCount')
      .leftJoin('list.likes', 'like')
      .leftJoin('list.comments', 'comment')
      .groupBy('list.id')
      .where('list.id = :listId', { listId });

    if (userId !== undefined) {
      query
        .addSelect(
          'CASE WHEN userLike.id IS NOT NULL THEN TRUE ELSE FALSE END',
          'userLiked',
        )
        .leftJoin('like.user', 'userLike', 'userLike.id = :userId', { userId })
        .addGroupBy('userLike.id');
    } else {
      query.addSelect('FALSE', 'userLiked');
    }

    const data = await query.getRawOne();

    return {
      likesAmount: Number(data.likesCount ?? 0),
      commentsAmount: Number(data.commentsCount ?? 0),
      isLiked: data.userLiked ?? false,
    };
  }

  async getListsStatistics(
    listIds: number[],
    userId?: number,
  ): Promise<
    Map<
      number,
      Omit<
        AdditionalListInfo,
        'isFavorite' | 'isViewed' | 'isUpdatedSinceLastView'
      >
    >
  > {
    const query = this.createQueryBuilder('list')
      .select('list.id', 'id')
      .addSelect('COUNT(DISTINCT like.id)', 'likesCount')
      .addSelect('COUNT(DISTINCT comment.id)', 'commentsCount')
      .leftJoin('list.likes', 'like')
      .leftJoin('list.comments', 'comment')
      .groupBy('list.id')
      .where('list.id = ANY(:listIds)', { listIds });

    if (userId !== undefined) {
      query
        .addSelect(
          'CASE WHEN userLike.id IS NOT NULL THEN TRUE ELSE FALSE END',
          'userLiked',
        )
        .leftJoin('like.user', 'userLike', 'userLike.id = :userId', { userId })
        .addGroupBy('userLike.id');
    } else {
      query.addSelect('FALSE', 'userLiked');
    }

    const data = await query.getRawMany();

    const infos = data.map((data) => ({
      likesAmount: Number(data.likesCount ?? 0),
      commentsAmount: Number(data.commentsCount ?? 0),
      isLiked: data.userLiked ?? false,
      id: Number(data.id),
    }));

    return new Map(
      infos.map<
        [
          number,
          Omit<
            AdditionalListInfo,
            | 'isFavorite'
            | 'isViewed'
            | 'isViewedUpdate'
            | 'isUpdatedSinceLastView'
          >,
        ]
      >((i) => [
        i.id,
        {
          commentsAmount: i.commentsAmount,
          isLiked: i.isLiked,
          likesAmount: i.likesAmount,
        },
      ]),
    );
  }

  async getLatestUpdates(
    userId: number,
    lowerBound?: Date,
    limit = 20,
    order?: Order,
  ) {
    const dateField = this.getDateFieldByOrder(order);

    const query = this.createQueryBuilder('list')
      .select([
        'list.id',
        'list.image_url',
        'list.name',
        'list.is_public',
        'list.created_at',
        'list.updated_at',

        'user.id',
        'user.username',
        'user.image_url',
      ])
      .innerJoin('list.user', 'user')
      .innerJoin('Subscription', 'sub', 'sub.followed = user.id')
      .where('sub.follower = :userId', { userId })
      .andWhere('list.is_public = TRUE')
      .orderBy(`list.${dateField}`, 'DESC')
      .take(limit + 1);

    if (lowerBound !== undefined) {
      const { date, operator } = this.getRAWDatesCompareString(lowerBound);
      query.andWhere(`list.${dateField} ${operator} :lowerBound`, {
        lowerBound: date,
      });
    }

    const latestUpdatedLists = await query.getMany();

    return this.processPagination(latestUpdatedLists, limit, dateField);
  }

  async getLatestUpdatesAmount(userId: number): Promise<number> {
    return this.createQueryBuilder('list')
      .innerJoin(Subscription, 'sub', 'list.userId = sub.followed.id')
      .leftJoinAndSelect(
        ListView,
        'view',
        'list.id = view.listId AND view.userId = :userId',
        { userId },
      )
      .where('sub.follower.id = :userId', { userId })
      .andWhere('view.id IS NULL')
      .andWhere('list.is_public = TRUE')
      .getCount();
  }

  private getDateFieldByOrder(order?: Order) {
    if (!order) {
      return 'updated_at';
    }
    if (order === Order.created) return 'created_at';
    if (order === Order.updated) return 'updated_at';
    return 'updated_at';
  }
}
