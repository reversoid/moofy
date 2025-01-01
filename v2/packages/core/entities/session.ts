import { Id } from "../utils/id";
import { User } from "./user";

export class Session {
  id: string;
  userId: User["id"];
  expiresAt: Date;

  constructor(props: { id: string; userId: User["id"]; expiresAt: Date }) {
    this.id = props.id;
    this.userId = props.userId;
    this.expiresAt = props.expiresAt;
  }
}
