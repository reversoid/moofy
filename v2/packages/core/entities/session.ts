import { User } from "./user";
import { Entity } from "./entity";

export class Session extends Entity {
  id: string;
  user: User;
  expiresAt: Date;

  constructor(props: { id: string; user: User; expiresAt: Date }) {
    super();

    this.id = props.id;
    this.user = props.user;
    this.expiresAt = props.expiresAt;
  }
}
