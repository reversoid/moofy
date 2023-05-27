import { Controller, Get, Query } from '@nestjs/common';
import { ExternalMovieProxyService } from './externalMovieProxy.service';
import { Film } from '../film/entities/film.entity';

@Controller('search-films')
export class SearchProxyController {
  constructor(
    private readonly externalMovieProxyService: ExternalMovieProxyService,
  ) {}

  @Get('') async searchFilmsByName(
    @Query('filmName') filmName: string,
    @Query('limit') limit = 5,
  ): Promise<{ items: Film[] }> {
    const films = await this.externalMovieProxyService.searchFilmsByName(
      filmName,
    );
    return { items: films.slice(0, limit) };
  }
}
