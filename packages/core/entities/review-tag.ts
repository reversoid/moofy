import { Id } from "../utils";
import { Entity } from "./entity";

export class ReviewTag extends Entity {
  id: Id;
  reviewId: Id;
  collectionTagId: Id;

  constructor(props: { id?: Id; reviewId: Id; collectionTagId: Id }) {
    super();

    this.id = props.id ?? new Id();
    this.reviewId = props.reviewId;
    this.collectionTagId = props.collectionTagId;
  }
}
