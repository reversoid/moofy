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
    description: string | null;
    imageUrl: string | null;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id ?? null;
    this.username = props.username;
    this.description = props.description;
    this.imageUrl = props.imageUrl;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
