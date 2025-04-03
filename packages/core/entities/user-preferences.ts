import { Entity } from "./entity";
import { buildCreate } from "../utils/create-entity";

import { Id } from "../utils";

export enum NotifyUpdateType {
  bugfix = "bugfix",
  feature = "feature",
  improvement = "improvement",
}

export class UserPreferences extends Entity {
  static create = buildCreate(UserPreferences);

  id: Id;
  userId: Id;
  notifyUpdateTypes: NotifyUpdateType[];

  constructor(props: {
    id?: Id;
    userId: Id;
    notifyUpdateTypes: NotifyUpdateType[];
  }) {
    super();

    this.id = props.id ?? new Id();
    this.userId = props.userId;
    this.notifyUpdateTypes = props.notifyUpdateTypes;
  }
}
