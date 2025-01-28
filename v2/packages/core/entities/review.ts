import { Id } from "../utils/id";
import { Entity } from "./entity";
import { Film } from "./film";

export class Review extends Entity {
  id: Id;
  score: number | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  film: Film;
  collectionId: Id;
  userId: Id;

  constructor(props: {
    id?: Id;
    score?: number | null;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    film: Film;
    collectionId: Id;
    userId: Id;
  }) {
    super();

    const now = new Date();

    this.id = props.id ?? new Id();
    this.score = props.score ?? null;
    this.description = props.description ?? null;
    this.createdAt = props.createdAt ?? now;
    this.updatedAt = props.updatedAt ?? now;
    this.film = props.film;
    this.collectionId = props.collectionId;
    this.userId = props.userId;
  }
}
