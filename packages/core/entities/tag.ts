import { Id } from "../utils/id";
import { Entity } from "./entity";
import { buildCreate } from "../utils/create-entity";

export class Tag extends Entity {
  static create = buildCreate(Tag);

  id: Id;
  name: string;
  hexColor: string;
  createdAt: Date;
  collectionId: Id;
  description: string | null;

  constructor(props: {
    id?: Id;
    name: string;
    hexColor: string;
    createdAt?: Date;
    collectionId: Id;
    description?: string | null;
  }) {
    super();

    this.id = props.id ?? new Id();
    this.name = props.name;
    this.hexColor = props.hexColor;
    this.createdAt = props.createdAt ?? new Date();
    this.collectionId = props.collectionId;
    this.description = props.description ?? null;
  }
}
