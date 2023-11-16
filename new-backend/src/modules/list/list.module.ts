import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListCommentsController } from './list-comments.controller';

@Module({
  controllers: [ListController, ListCommentsController],
})
export class ListModule {}
