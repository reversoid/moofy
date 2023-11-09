import { Controller, Get, Param, Query } from '@nestjs/common';
import { ExternalMovieProxyService } from './externalMovieProxy.service';
import { Film } from '../film/entities/film.entity';

@Controller()
export class SearchProxyController {
  constructor(
    private readonly externalMovieProxyService: ExternalMovieProxyService,
  ) {}

  @Get('search-films') async searchFilmsByName(
    @Query('filmName') filmName: string,
    @Query('limit') limit = 5,
  ): Promise<{ items: Film[] }> {
    const films =
      await this.externalMovieProxyService.searchFilmsByName(filmName);
    return { items: films.slice(0, limit) };
  }

  @Get('film/:id') async getFilmById(
    @Param('id') id: string,
  ): Promise<{ film: Film }> {
    const film = await this.externalMovieProxyService.getFilmById(id);
    return { film };
  }
}
