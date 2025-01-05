import { CoreError } from "../../utils/error";

export class AlreadyFollowingError extends CoreError {
  constructor() {
    super("Already Following User");
  }
}

export class NotFollowingError extends CoreError {
  constructor() {
    super("Not Following User");
  }
}

export class CannotFollowSelfError extends CoreError {
  constructor() {
    super("Cannot Follow Self");
  }
}
