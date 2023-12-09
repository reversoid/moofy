import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmRepository } from './film.repository';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { ExternalFilmProxyModule } from '../external-film-proxy/external-film-proxy.module';

@Module({
  providers: [FilmService, FilmRepository, PrismaService],
  exports: [FilmService],
  imports: [ExternalFilmProxyModule],
})
export class FilmModule {}
