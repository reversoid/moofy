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
    userId: number,
    listIds: number[],
  ): Promise<Map<number, boolean>> {
    const result = (await this.manager
      .createQueryBuilder()
      .from(List, 'list')
      .select([
        'list.id',
        'CASE WHEN view.id IS NULL THEN FALSE ELSE TRUE END AS is_viewed',
      ])
      .leftJoin('list.views', 'view', 'view.user.id = :userId', { userId })
      .where('list.id = ANY(:listIds)', { listIds })
      .getRawMany()) as { list_id: number; is_viewed: boolean }[];

    return new Map<number, boolean>(
      result.map<[number, boolean]>((item) => [item.list_id, item.is_viewed]),
    );
  }
}
