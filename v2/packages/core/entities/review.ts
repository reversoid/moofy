import { Id } from "../utils/id";
import { Film } from "./film";

export class Review {
  id: Id | null;
  score: number | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  film: Film;

  constructor(props: {
    id?: Id;
    score: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    film: Film;
  }) {
    this.id = props.id ?? null;
    this.score = props.score;
    this.description = props.description;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.film = props.film;
  }
}
