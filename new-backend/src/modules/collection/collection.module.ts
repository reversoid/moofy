import { Module } from '@nestjs/common';
import { CollectionController } from './controller/collection.controller';
import { CollectionService } from './collection.service';
import { CollectionRepository } from './collection.repository';
import { CollectionReviewModule } from '../collection-review/collection-review.module';
import { EventsModule } from '../events/events.module';
import { PrismaService } from 'src/shared/utils/prisma-service';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService, CollectionRepository, PrismaService],
  imports: [CollectionReviewModule, EventsModule],
  exports: [CollectionService],
})
export class CollectionModule {}
