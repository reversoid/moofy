export enum UnofficialKpFilmType {
  FILM = 'FILM',
  TV_SERIES = 'TV_SERIES',
  TV_SHOW = 'TV_SHOW',
  MINI_SERIES = 'MINI_SERIES',
  VIDEO = 'VIDEO',
}

type UnofficialKpFilmBaseDto = {
  nameRu: string;
  nameEn: string;
  year: string;
  posterUrl: string;
  posterUrlPreview: string;
  filmLength: string;
  genres: { genre: string }[];
  type: UnofficialKpFilmType;
};

export interface SearchUnofficialKpFilmDto extends UnofficialKpFilmBaseDto {
  filmId: number;
}

export interface UnofficialKpFilmDto extends UnofficialKpFilmBaseDto {
  kinopoiskId: number;
}
