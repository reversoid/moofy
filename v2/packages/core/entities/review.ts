import { initCreateEntity } from "../utils/create-entity";
import { Id } from "../utils/id";
import { Film } from "./film";

export class Review {
  static create = initCreateEntity(Review);

  id: Id | null;
  score: number | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  film: Film;

  constructor(props: {
    id?: Id;
    score?: number | null;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    film: Film;
  }) {
    const now = new Date();

    this.id = props.id ?? null;
    this.score = props.score ?? null;
    this.description = props.description ?? null;
    this.createdAt = props.createdAt ?? now;
    this.updatedAt = props.updatedAt ?? now;
    this.film = props.film;
  }
}
