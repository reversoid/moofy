import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { FilmService } from './film.service';
import { FilmRepository } from './repositories/film.repository';
import { ExternalMovieProxyModule } from '../externalMovieProxy/externalMovieProxy.module';
import { ToWatch } from './entities/toWatch.entity';
import { ToWatchRepository } from './repositories/toWatchRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Film, ToWatch]),
    ExternalMovieProxyModule,
  ],
  providers: [FilmService, FilmRepository, ToWatchRepository],
  exports: [TypeOrmModule, FilmService, FilmRepository, ToWatchRepository],
})
export class FilmModule {}
