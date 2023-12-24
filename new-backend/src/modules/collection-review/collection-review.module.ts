import { Module } from '@nestjs/common';
import { CollectionReviewService } from './collection-review.service';
import { CollectionReviewsController } from './controller/collection-review.controller';
import { FilmModule } from '../film/film.module';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CollectionReviewRepository } from './repository/collection-review.repository';
import { ReviewsController } from './controller/reviews.controller';

@Module({
  controllers: [CollectionReviewsController, ReviewsController],
  providers: [
    CollectionReviewService,
    CollectionReviewRepository,
    PrismaService,
  ],
  exports: [CollectionReviewService],
  imports: [FilmModule],
})
export class CollectionReviewModule {}
