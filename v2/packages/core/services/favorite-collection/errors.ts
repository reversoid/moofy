import { CoreError } from "../../utils/error";

export class CollectionAlreadyFavoritedError extends CoreError {
  constructor() {
    super("Collection Already Favorited");
  }
}

export class CollectionNotFavoritedError extends CoreError {
  constructor() {
    super("Collection Not Favorited");
  }
}

export class CollectionIsPrivateError extends CoreError {
  constructor() {
    super("Collection Is Private");
  }
}
