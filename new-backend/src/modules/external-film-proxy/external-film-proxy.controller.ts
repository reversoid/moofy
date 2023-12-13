import { Controller, Get, Query } from '@nestjs/common';
import { ExternalFilmApiService } from './external-film-api.service';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { searchFilmsResponseSchema } from './controller/responses/search-films.response';
import { IExternalFilmProxyController } from './controller/external-film-proxy.interface';

@Controller('films')
export class ExternalFilmProxyController
  implements IExternalFilmProxyController
{
  constructor(private readonly externalFilmProxy: ExternalFilmApiService) {}

  @Get()
  @HttpResponse(searchFilmsResponseSchema)
  async searchFilms(@Query('search') search: string = '') {
    const films = await this.externalFilmProxy.searchFilmsByName(search);

    return { items: films, nextKey: null };
  }
}
