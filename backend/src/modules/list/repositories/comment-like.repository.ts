import { Injectable } from '@nestjs/common';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';
import { DataSource } from 'typeorm';
import { CommentLike } from '../entities/comment-like.entity';
// import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';

@Injectable()
export class CommentLikeRepository extends PaginatedRepository<CommentLike> {
  constructor(dataSource: DataSource) {
    super(CommentLike, dataSource.createEntityManager());
  }
}
