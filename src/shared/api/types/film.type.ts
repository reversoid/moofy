export enum FilmType {
  FILM = 'FILM',
  TV_SERIES = 'TV_SERIES',
  TV_SHOW = 'TV_SHOW',
  MINI_SERIES = 'MINI_SERIES',
}

export interface Film {
  id: string;
  name: string;
  year: number;
  type: FilmType;
  filmLength: string;
  posterPreviewUrl: string;
  posterUrl: string;
  genres: string[];
}
