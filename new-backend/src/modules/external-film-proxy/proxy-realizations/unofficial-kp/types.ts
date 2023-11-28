export enum UnofficialKpFilmType {
  FILM = 'FILM',
  TV_SERIES = 'TV_SERIES',
  TV_SHOW = 'TV_SHOW',
  MINI_SERIES = 'MINI_SERIES',
  VIDEO = 'VIDEO',
}

export type UnofficialKpFilmDto = {
  kinopoiskId?: number;
  filmId?: number;
  nameRu: string;
  nameEn: string;
  year: number;
  posterUrl: string;
  posterUrlPreview: string;
  filmLength: string;
  genres: { genre: string }[];
  type: UnofficialKpFilmType;
};
