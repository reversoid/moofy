import { Id } from "../utils/id";
import { Entity } from "./entity";
import { User } from "./user";

export class Collection extends Entity {
  id: Id;
  name: string;
  description: string | null;
  isPublic: boolean;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  creator: User;

  constructor(props: {
    id?: Id;
    name: string;
    description?: string | null;
    isPublic: boolean;
    imageUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    creator: User;
  }) {
    super();

    this.id = props.id ?? new Id();
    this.name = props.name;
    this.description = props.description ?? null;
    this.isPublic = props.isPublic;
    this.imageUrl = props.imageUrl ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.creator = props.creator;
  }
}
