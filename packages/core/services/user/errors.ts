import { CoreError } from "../../utils/error";

export class UsernameExistsError extends CoreError {
  constructor() {
    super("Username Already Taken");
  }
}

export class UserNotFoundError extends CoreError {
  constructor() {
    super("User Not Found");
  }
}

export class WrongPasswordError extends CoreError {
  constructor() {
    super("Wrong Password");
  }
}
