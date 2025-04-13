import { Id } from "../utils";
import { Entity } from "./entity";
import { buildCreate } from "../utils/create-entity";

export enum FilmType {
  FILM = "FILM",
  TV_SERIES = "TV_SERIES",
  TV_SHOW = "TV_SHOW",
  MINI_SERIES = "MINI_SERIES",
  VIDEO = "VIDEO",
}

export class Film extends Entity {
  static create = buildCreate(Film);

  id: Id;
  kinopoiskId: string;
  name: string;
  year: number;
  type: FilmType;
  filmLength: string | null;
  posterPreviewUrl: string;
  posterUrl: string;
  genres: string[];

  constructor(props: {
    id?: Id;
    kinopoiskId: string;
    name: string;
    year: number;
    type: FilmType;
    filmLength?: string | null;
    posterPreviewUrl: string;
    posterUrl: string;
    genres: string[];
  }) {
    super();

    this.id = props.id ?? new Id();
    this.kinopoiskId = props.kinopoiskId;
    this.name = props.name;
    this.year = props.year;
    this.type = props.type;
    this.filmLength = props.filmLength ?? null;
    this.posterPreviewUrl = props.posterPreviewUrl;
    this.posterUrl = props.posterUrl;
    this.genres = props.genres;
  }
}
