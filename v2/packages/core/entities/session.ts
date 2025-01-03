import { User } from "./user";

export class Session {
  id: string;
  user: User;
  expiresAt: Date;

  constructor(props: { id: string; user: User; expiresAt: Date }) {
    this.id = props.id;
    this.user = props.user;
    this.expiresAt = props.expiresAt;
  }
}
