import { CoreError } from "../../utils";

export class SessionNotFoundError extends CoreError {
  constructor() {
    super("Session Not Found");
  }
}

export class SessionExpiredError extends CoreError {
  constructor() {
    super("Session Expired");
  }
}
