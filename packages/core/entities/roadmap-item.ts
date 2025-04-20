import { Id } from "../utils";
import { Entity } from "./entity";

export class RoadmapItem extends Entity {
  id: Id;
  title: string;
  description: string;
  orderNumber: number;

  constructor(props: {
    id?: Id;
    title: string;
    description: string;
    orderNumber: number;
  }) {
    super();

    this.id = props.id ?? new Id();
    this.title = props.title;
    this.description = props.description;
    this.orderNumber = props.orderNumber;
  }
}
