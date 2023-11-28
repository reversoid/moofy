import { Inject, Injectable } from '@nestjs/common';
import { ExternalFilmApiService } from '../types';
import { Film } from 'src/modules/film/models/film';
import apiKeysConfig from 'src/config/api-keys.config';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ApiKeyRotator } from '../../utils/api-key-rotator';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { UnofficialKpFilmDto } from './types';

@Injectable()
export class UnnoficialKpService implements ExternalFilmApiService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiKeysConfig.KEY)
    private config: ConfigType<typeof apiKeysConfig>,
  ) {}

  private baseUrl = 'https://kinopoiskapiunofficial.tech/api';

  private keyRotator = new ApiKeyRotator(this.config.unofficialKpApiKeys);

  getFilmById(id: string): Promise<Film | null> {
    return lastValueFrom(
      this.httpService
        .get<UnofficialKpFilmDto>(`${this.baseUrl}/v2.2/films/${id}`, {
          headers: {
            'X-API-KEY': this._getKey(),
          },
        })
        .pipe(
          map(({ data: filmDto }) => this.convertDtoToFilm(filmDto)),
          catchError((e) => {
            console.log(e);
            return of(null);
          }),
        ),
    );
  }

  searchFilmsByName(name: string): Promise<Film[]> {
    return lastValueFrom(
      this.httpService
        .get<{ films: UnofficialKpFilmDto[] }>(
          `${this.baseUrl}/v2.1/films/search-by-keyword`,
          {
            params: {
              keyword: name,
            },
            headers: {
              'X-API-KEY': this._getKey(),
            },
          },
        )
        .pipe(
          map(({ data: { films } }) => {
            return films.map(this.convertDtoToFilm).filter(Boolean) as Film[];
          }),
          catchError(() => of([])),
        ),
    );
  }

  private _getKey() {
    return this.keyRotator.currentKey;
  }

  private convertDtoToFilm(dto: UnofficialKpFilmDto): Film | null {
    if (!dto.kinopoiskId || !dto.nameRu || !dto.posterUrlPreview) {
      return null;
    }

    return {
      id: String(dto.kinopoiskId),
      genres: dto.genres.map(({ genre }) => genre),
      name: dto.nameRu,
      posterPreviewUrl: dto.posterUrlPreview,
      posterUrl: dto.posterUrl,
      year: dto.year,
      type: dto.type,
    };
  }
}
