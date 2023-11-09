import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { UnofficalKinopoisk } from '../types/film.dto';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { Film } from 'src/modules/film/entities/film.entity';
import apiKeysConfig from 'src/config/apiKeys.config';
import { ConfigType } from '@nestjs/config';
import { ApiKeyRotator } from '../utils/ApiKeyRotator';

@Injectable()
export class UnofficialKpService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(apiKeysConfig.KEY)
    private config: ConfigType<typeof apiKeysConfig>,
  ) {}

  private baseUrl = 'https://kinopoiskapiunofficial.tech/api';

  private keyRotator = new ApiKeyRotator(this.config.unofficialKpApiKeys);

  async searchFilmsByName(name: string): Promise<Film[] | null> {
    return lastValueFrom(
      this.httpService
        .get<{ films: UnofficalKinopoisk.FilmDTO[] }>(
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
            return films.map<Film>((filmDto) => this.toFilm(filmDto));
          }),
        )
        .pipe(catchError(() => of(null))),
    );
  }

  private _getKey() {
    return this.keyRotator.getCurrentKey();
  }

  async getFilmById(id: string): Promise<Film | null> {
    return lastValueFrom(
      this.httpService
        .get<UnofficalKinopoisk.FilmDTO>(`${this.baseUrl}/v2.2/films/${id}`, {
          headers: {
            'X-API-KEY': this._getKey(),
          },
        })
        .pipe(map(({ data: filmDto }) => this.toFilm(filmDto)))
        .pipe(
          catchError((e) => {
            console.log(e);
            return of(null);
          }),
        ),
    );
  }

  private toFilm(dto: UnofficalKinopoisk.FilmDTO): Film {
    const film = new Film();

    film.id = String(dto.kinopoiskId || dto.filmId);
    film.filmLength = dto.filmLength;
    film.genres = dto.genres.map((g) => g.genre);
    film.name = dto.nameRu;
    film.posterPreviewUrl = dto.posterUrlPreview;
    film.posterUrl = dto.posterUrl;
    film.type = dto.type;
    film.year = dto.year;

    return film;
  }
}
