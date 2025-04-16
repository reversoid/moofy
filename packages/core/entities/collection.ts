import { Id } from "../utils/id";
import { Entity } from "./entity";
import { User } from "./user";
import { buildCreate } from "../utils/create-entity";

export class Collection extends Entity {
  static create = buildCreate(Collection);

  id: Id;
  name: string;
  description: string | null;
  isPublic: boolean;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  creator: User;
  isPersonal: boolean;

  constructor(props: {
    id?: Id;
    name: string;
    description?: string | null;
    isPublic: boolean;
    imageUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    creator: User;
    isPersonal?: boolean;
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
    this.isPersonal = props.isPersonal ?? false;
  }
}
