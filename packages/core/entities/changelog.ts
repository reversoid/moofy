import { Id } from "../utils";
import { Entity } from "./entity";

export class Changelog extends Entity {
  id: Id;
  description: string;
  release_date: Date;
  version: string;
  has_bugfix: boolean;
  has_feature: boolean;
  has_improvement: boolean;

  constructor(props: {
    id?: Id;
    description: string;
    release_date: Date;
    version: string;
    has_bugfix: boolean;
    has_feature: boolean;
    has_improvement: boolean;
  }) {
    super();

    this.id = props.id ?? new Id();
    this.description = props.description;
    this.release_date = props.release_date;
    this.version = props.version;
    this.has_bugfix = props.has_bugfix;
    this.has_feature = props.has_feature;
    this.has_improvement = props.has_improvement;
  }
}
