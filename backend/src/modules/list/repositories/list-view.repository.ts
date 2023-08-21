import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ListView } from '../entities/list-view.entity';
import { List } from '../entities/list.entity';

@Injectable()
export class ListViewRepository extends Repository<ListView> {
  constructor(dataSource: DataSource) {
    super(ListView, dataSource.createEntityManager());
  }

  async markListAsViewed(userId: number, listId: number) {
    return this.save({ list: { id: listId }, user: { id: userId } });
  }

  async isListViewed(userId: number, listId: number) {
    const view = await this.findOneBy({
      list: { id: listId },
      user: { id: userId },
    });
    return Boolean(view);
  }

  async areListsViewed(
    listIds: number[],
    userId?: number,
  ): Promise<Map<number, boolean>> {
    const query = this.manager
      .createQueryBuilder()
      .from(List, 'list')
      .select(['list.id'])
      .where('list.id = ANY(:listIds)', { listIds });

    if (userId !== undefined) {
      query
        .addSelect(
          'CASE WHEN view.id IS NULL THEN FALSE ELSE TRUE END',
          'is_viewed',
        )
        .leftJoin('list.views', 'view', 'view.user.id = :userId', { userId });
    } else {
      query.addSelect('FALSE', 'is_viewed');
    }

    const result = (await query.getRawMany()) as {
      list_id: number;
      is_viewed: boolean;
    }[];

    return new Map<number, boolean>(
      result.map<[number, boolean]>((item) => [item.list_id, item.is_viewed]),
    );
  }
}
