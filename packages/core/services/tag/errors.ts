import { CoreError } from "../../utils";

export class TagNotFoundError extends CoreError {
  constructor() {
    super("Tag Not Found");
  }
}
