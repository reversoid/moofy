import { Entity } from "./entity";

export enum FilmType {
  FILM = "FILM",
  TV_SERIES = "TV_SERIES",
  TV_SHOW = "TV_SHOW",
  MINI_SERIES = "MINI_SERIES",
  VIDEO = "VIDEO",
}

export class Film extends Entity {
  id: string;
  name: string;
  year: number;
  type: FilmType;
  filmLength: string;
  posterPreviewUrl: string;
  posterUrl: string;
  genres: string[];

  constructor(props: {
    id: string;
    name: string;
    year: number;
    type: FilmType;
    filmLength: string;
    posterPreviewUrl: string;
    posterUrl: string;
    genres: string[];
  }) {
    super();

    this.id = props.id;
    this.name = props.name;
    this.year = props.year;
    this.type = props.type;
    this.filmLength = props.filmLength;
    this.posterPreviewUrl = props.posterPreviewUrl;
    this.posterUrl = props.posterUrl;
    this.genres = props.genres;
  }
}
