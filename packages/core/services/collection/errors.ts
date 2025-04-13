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

export class AlreadyLikedCollectionError extends CoreError {
  constructor() {
    super("Collection Already Liked");
  }
}

export class NotLikedCollectionError extends CoreError {
  constructor() {
    super("Collection Not Liked");
  }
}

export class PersonalCollectionExistsError extends CoreError {
  constructor() {
    super("Personal Collection Exists");
  }
}

export class PersonalCollectionNotFoundError extends CoreError {
  constructor() {
    super("Personal Collection Does Not Exist");
  }
}

export class DeleteLinkedPersonalCollectionError extends CoreError {
  constructor() {
    super("Cannot Delete Personal Collection That Is Liked To Profile");
  }
}
