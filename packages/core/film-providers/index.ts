export enum ProviderFilmType {
  FILM = "FILM",
  TV_SERIES = "TV_SERIES",
  TV_SHOW = "TV_SHOW",
  MINI_SERIES = "MINI_SERIES",
  VIDEO = "VIDEO",
}

export type ProviderFilmDto = {
  kinopoiskId: string;
  name: string;
  year: number;
  type: ProviderFilmType;
  filmLength: string | null;
  posterPreviewUrl: string;
  posterUrl: string;
  genres: string[];
};

export interface IFilmProvider {
  searchFilmsByName(name: string, limit: number): Promise<ProviderFilmDto[]>;
  getFilmByKpId(id: string): Promise<ProviderFilmDto | null>;
}
