import { Module } from '@nestjs/common';
import { CollectionController } from './controller/collection.controller';
import { CollectionService } from './collection.service';
import { CollectionRepository } from './repositories/collection.repository';
import { CollectionReviewModule } from '../collection-review/collection-review.module';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService, CollectionRepository],
  imports: [CollectionReviewModule],
})
export class CollectionModule {}
