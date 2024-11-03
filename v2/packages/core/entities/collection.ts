import { Id } from "../utils/id";
import { User } from "./user";

export class Collection {
  id: Id | null;
  name: string;
  description: string | null;
  isPublic: boolean;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  creator: User;

  constructor(props: {
    id?: Id;
    name: string;
    description?: string | null;
    isPublic: boolean;
    imageUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
    creator: User;
  }) {
    this.id = props.id ?? null;
    this.name = props.name;
    this.description = props.description ?? null;
    this.isPublic = props.isPublic;
    this.imageUrl = props.imageUrl ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.creator = props.creator;
  }
}
