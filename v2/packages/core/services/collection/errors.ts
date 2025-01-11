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

export class CannotSeePrivateCollectionError extends CoreError {
  constructor() {
    super("Cannot See Private Collection");
  }
}
