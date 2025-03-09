import { Id } from "../utils/id";
import { Entity } from "./entity";

export class User extends Entity {
  id: Id;
  username: string;
  description: string | null;
  imageUrl: string | null;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id?: Id;
    username: string;
    description?: string | null;
    imageUrl?: string | null;
    passwordHash: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super();

    const now = new Date();

    this.id = props.id ?? new Id();
    this.username = props.username;
    this.description = props.description ?? null;
    this.imageUrl = props.imageUrl ?? null;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt ?? now;
    this.updatedAt = props.updatedAt ?? now;
  }
}
