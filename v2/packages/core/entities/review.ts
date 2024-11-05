import { initCreateEntity } from "../utils/create-entity";
import { Id } from "../utils/id";
import { Film } from "./film";

export class Review {
  id: Id;
  score: number | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  film: Film;
  collectionId: Id;

  constructor(props: {
    id?: Id;
    score?: number | null;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    film: Film;
    collectionId: Id;
  }) {
    const now = new Date();

    this.id = props.id ?? new Id();
    this.score = props.score ?? null;
    this.description = props.description ?? null;
    this.createdAt = props.createdAt ?? now;
    this.updatedAt = props.updatedAt ?? now;
    this.film = props.film;
    this.collectionId = props.collectionId;
  }
}
