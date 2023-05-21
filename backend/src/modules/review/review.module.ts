import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmModule } from '../film/film.module';
import { ListModule } from '../list/list.module';
import { UserModule } from '../user/user.module';
import { Review } from './entities/review.entity';
import { ReviewRepository } from './repositories/review.repository';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [
    ListModule,
    UserModule,
    TypeOrmModule.forFeature([Review]),
    FilmModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
  exports: [TypeOrmModule, ReviewRepository],
})
export class ReviewModule {}
