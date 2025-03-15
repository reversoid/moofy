import { Id } from "../utils";
import { Entity } from "./entity";

export class CollectionTag extends Entity {
  id: Id;
  name: string;
  hslColor: string;
  collectionId: Id;
  createdAt: Date;

  constructor(props: {
    id?: Id;
    name: string;
    hslColor: string;
    collectionId: Id;
    createdAt?: Date;
  }) {
    super();

    this.id = props.id ?? new Id();
    this.name = props.name;
    this.hslColor = props.hslColor;
    this.collectionId = props.collectionId;
    this.createdAt = props.createdAt ?? new Date();
  }
}
