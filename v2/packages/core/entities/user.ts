import { initCreateEntity } from "../utils/create-entity";
import { Id } from "../utils/id";

export class User {
  static create = initCreateEntity(User);

  id: Id | null;
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
    const now = new Date();

    this.id = props.id ?? null;
    this.username = props.username;
    this.description = props.description ?? null;
    this.imageUrl = props.imageUrl ?? null;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt ?? now;
    this.updatedAt = props.updatedAt ?? now;
  }
}
