import { Entity } from "./entity";

import { Id } from "../utils";

export enum NotifyUpdateType {
  bugfix = "bugfix",
  feature = "feature",
  improvement = "improvement",
}

export class UserPreference extends Entity {
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
