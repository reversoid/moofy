import { Injectable } from '@nestjs/common';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';
import { DataSource } from 'typeorm';
import { Comment } from '../entities/comment.entity';
// import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';

@Injectable()
export class ListLikeRepository extends PaginatedRepository<Comment> {
  constructor(dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }
}
