import { FilmType } from 'src/modules/film/entities/film.entity';

/** Film info by https://api.kinopoisk.dev */
export namespace OfficalKinopoisk {
  export class FilmDTO {
    id: number;
    name: string;
    year: number;
    poster: {
      previewUrl: string;
      url: string;
    };
    length: string;
    genres: string[];
    type: FilmType;
  }
}

/** Film info by https://kinopoiskapiunofficial.tech */
export namespace UnofficalKinopoisk {
  export class FilmDTO {
    kinopoiskId?: number;
    filmId?: number;
    nameRu: string;
    nameEn: string;
    year: number;
    posterUrl: string;
    posterUrlPreview: string;
    filmLength: string;
    genres: { genre: string }[];
    type: FilmType;
  }
}
