import { CoreError } from "../../utils/error";

export class CollectionNotFoundError extends CoreError {
  constructor() {
    super("Collection Not Found");
  }
}

export class NotOwnerOfCollectionError extends CoreError {
  constructor() {
    super("User Is Not The Owner Of This Collection");
  }
}

export class NoAccessToPrivateCollectionError extends CoreError {
  constructor() {
    super("No Access To Private Collection");
  }
}
