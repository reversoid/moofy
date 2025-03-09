import { CoreError } from "../../utils/error";

export class FilmAlreadyExistsError extends CoreError {
  constructor() {
    super("Film Already Exists");
  }
}
