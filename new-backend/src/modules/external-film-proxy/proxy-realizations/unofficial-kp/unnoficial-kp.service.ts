import { Inject, Injectable } from '@nestjs/common';
import { IApiFilmService } from '../types';
import { Film } from 'src/modules/film/models/film';
import apiKeysConfig from 'src/config/api-keys.config';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ApiKeyRotator } from '../../utils/api-key-rotator';
import { catchError, lastValueFrom, map, of, throwError } from 'rxjs';
import { SearchUnofficialKpFilmDto, UnofficialKpFilmDto } from './types';

@Injectable()
export class UnnoficialKpService implements IApiFilmService {
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
            return throwError(() => e);
          }),
        ),
    );
  }

  searchFilmsByName(name: string): Promise<Film[]> {
    return lastValueFrom(
      this.httpService
        .get<{ films: SearchUnofficialKpFilmDto[] }>(
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

  private convertDtoToFilm(
    dto: SearchUnofficialKpFilmDto | UnofficialKpFilmDto,
  ): Film | null {
    const year = parseInt(dto.year);

    if (!dto.nameRu || !dto.posterUrlPreview || isNaN(year)) {
      return null;
    }

    let id: null | string = null;
    if (this.isSearchDto(dto)) {
      id = dto.filmId ? String(dto.filmId) : '';
    } else {
      id = dto.kinopoiskId ? String(dto.kinopoiskId) : '';
    }
    if (!id) {
      return null;
    }

    return {
      id,
      genres: dto.genres.map(({ genre }) => genre),
      name: dto.nameRu,
      posterPreviewUrl: dto.posterUrlPreview,
      posterUrl: dto.posterUrl,
      year: year,
      type: dto.type,
    };
  }

  private isSearchDto(
    dto: SearchUnofficialKpFilmDto | UnofficialKpFilmDto,
  ): dto is SearchUnofficialKpFilmDto {
    return Boolean((dto as SearchUnofficialKpFilmDto).filmId);
  }
}
