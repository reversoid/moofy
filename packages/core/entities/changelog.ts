import { Id } from "../utils";
import { Entity } from "./entity";
import { buildCreate } from "../utils/create-entity";

export class Changelog extends Entity {
  static create = buildCreate(Changelog);

  id: Id;
  description: string;
  releaseDate: Date;
  createdAt: Date;
  version: string;
  hasBugfix: boolean;
  hasFeature: boolean;
  hasImprovement: boolean;

  constructor(props: {
    id?: Id;
    description: string;
    releaseDate: Date;
    version: string;
    hasBugfix: boolean;
    hasFeature: boolean;
    hasImprovement: boolean;
    createdAt?: Date;
  }) {
    super();

    this.id = props.id ?? new Id();
    this.createdAt = props.createdAt ?? new Date();

    this.description = props.description;
    this.releaseDate = props.releaseDate;
    this.version = props.version;
    this.hasBugfix = props.hasBugfix;
    this.hasFeature = props.hasFeature;
    this.hasImprovement = props.hasImprovement;
  }
}
