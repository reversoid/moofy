import { Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { OfficalKinopoisk } from '../types/film.dto';
import { Film } from 'src/modules/film/entities/film.entity';
import apiKeysConfig from 'src/config/apiKeys.config';
import { ConfigType } from '@nestjs/config';

const KINOPOISK_URL = 'https://api.kinopoisk.dev/movie';

type FilmDTO = OfficalKinopoisk.FilmDTO;

interface KinopoiskResponse {
  docs: FilmDTO[];
}

@Injectable()
export class OfficialKpService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiKeysConfig.KEY)
    private config: ConfigType<typeof apiKeysConfig>,
  ) {}

  async searchFilmsByName(name: string, limit: number) {
    const responseObservable = this.httpService
      .get<KinopoiskResponse>(KINOPOISK_URL, {
        params: {
          token: this.config.kpApiKey,
          field: 'name',
          search: name,
          isStrict: false,
          limit,
          sortField: 'votes.imdb',
          sortType: -1,
        },
      })
      .pipe(
        map((res) => ({
          items: this.responseToFilmEntities(res),
        })),
      );

    return lastValueFrom(responseObservable);
  }

  async getFilmsByIDs(ids: number[]) {
    const responseObservable = this.httpService
      .get<KinopoiskResponse>(KINOPOISK_URL, {
        params: this.generateParamsForIds(ids),
      })
      .pipe(
        map((res) => {
          const films = this.responseToFilmEntities(res);
          return { items: this.getCorrectFilmsOrder(ids, films) };
        }),
      );
    return lastValueFrom(responseObservable);
  }

  private getCorrectFilmsOrder(ids: number[], films: Film[]) {
    const filmsInCorrectOrder: Film[] = [];

    ids.forEach((id) => {
      const film = films.find((f) => f.id === String(id));
      filmsInCorrectOrder.push(film);
    });
    return filmsInCorrectOrder;
  }

  private responseToFilmEntities(
    response: AxiosResponse<KinopoiskResponse, any>,
  ): Film[] {
    return response.data.docs.map((filmData) => {
      const film = new Film();

      film.year = filmData.year;
      film.filmLength = filmData.length;
      film.genres = filmData.genres;
      film.id = String(filmData.id);
      film.name = filmData.name;
      film.posterPreviewUrl = filmData.poster.previewUrl;
      film.posterUrl = filmData.poster.url;
      film.type = filmData.type;
      return film;
    });
  }

  private generateParamsForIds(ids: number[]) {
    const params = new URLSearchParams();
    params.append('token', this.config.kpApiKey);

    ids.forEach((id) => {
      params.append('field', 'id');
      params.append('search', String(id));
    });
    return params;
  }
}
