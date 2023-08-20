import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ListView } from '../entities/list-view.entity';

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
}
