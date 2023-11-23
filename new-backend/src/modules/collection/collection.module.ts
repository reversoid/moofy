import { Module } from '@nestjs/common';
import { CollectionController } from './controller/collection.controller';
import { CollectionService } from './collection.service';
import { CollectionRepository } from './repositories/collection.repository';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService, CollectionRepository],
})
export class CollectionModule {}
