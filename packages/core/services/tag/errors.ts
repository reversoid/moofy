import { CoreError } from "../../utils";

export class CollectionTagNotFoundError extends CoreError {
  constructor() {
    super("Collection Tag Not Found");
  }
}
