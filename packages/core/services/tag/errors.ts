import { CoreError } from "../../utils";

export class TagNotFoundError extends CoreError {
  constructor() {
    super("Tag Not Found");
  }
}

export class TagAlreadyLinkedToReviewError extends CoreError {
  constructor() {
    super("Tag Already Linked To Review");
  }
}

export class TagNotLinkedToReviewError extends CoreError {
  constructor() {
    super("Tag Not Linked To Review");
  }
}
