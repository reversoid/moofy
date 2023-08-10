import { Injectable } from '@nestjs/common';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';
import { DataSource } from 'typeorm';
import { ListLike } from '../entities/list-like.entity';
// import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';

@Injectable()
export class ListLikeRepository extends PaginatedRepository<ListLike> {
  constructor(dataSource: DataSource) {
    super(ListLike, dataSource.createEntityManager());
  }
}
