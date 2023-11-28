import { Module } from '@nestjs/common';
import { CollectionReviewService } from './collection-review.service';
import { CollectionReviewsController } from './collection-review.controller';
import { FilmModule } from '../film/film.module';

@Module({
  controllers: [CollectionReviewsController],
  providers: [CollectionReviewService],
  exports: [CollectionReviewService],
  imports: [FilmModule],
})
export class CollectionReviewModule {}
