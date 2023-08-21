import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';
import { FavoriteList } from '../entities/favoriteList.entity';
import { List } from '../entities/list.entity';

@Injectable()
export class FavoriteListRepository extends PaginatedRepository<FavoriteList> {
  constructor(dataSource: DataSource) {
    super(FavoriteList, dataSource.createEntityManager());
  }

  /** Get user favorite lists */
  async getUserFavoriteLists(userId: number, limit: number, lowerBound?: Date) {
    const lists = await this.find({
      where: {
        user: {
          id: userId,
        },
        created_at: super.getCompareOperator(lowerBound),
      },
      take: limit + 1,
      order: {
        created_at: 'DESC',
      },
      relations: {
        list: {
          user: true,
        },
      },
      select: {
        created_at: true,
        id: true,
        list: {
          user: {
            id: true,
            username: true,
            image_url: true,
          },
          created_at: true,
          description: true,
          id: true,
          image_url: true,
          is_public: true,
          name: true,
          updated_at: true,
          show_description: true,
          show_rating: true,
        },
      },
    });

    return super.processPagination(lists, limit, 'created_at');
  }

  async getAmountOfUserFavLists(userId: number) {
    return this.count({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async areListsFaved(
    userId: number,
    listIds: number[],
  ): Promise<Map<number, boolean>> {
    const result = (await this.createQueryBuilder()
      .from(List, 'list')
      .select([
        'list.id',
        'CASE WHEN fav.id IS NULL THEN FALSE ELSE TRUE END AS is_faved',
      ])
      .leftJoin(
        FavoriteList,
        'fav',
        'fav.listId = list.id AND fav.userId = :userId',
        { userId },
      )
      .where('list.id = ANY(:listIds)', { listIds })
      .getRawMany()) as { list_id: number; is_faved: boolean }[];

    return new Map<number, boolean>(
      result.map((item) => [item.list_id, item.is_faved]),
    );
  }

  async isFaved(userId: number, listId: number) {
    const result = await this.findOneBy({
      list: { id: listId },
      user: { id: userId },
    });
    return Boolean(result);
  }
}
