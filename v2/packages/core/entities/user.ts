import { Id } from "../utils/id";

export class User {
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
