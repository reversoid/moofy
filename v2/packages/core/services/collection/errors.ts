import { CoreError } from "../../utils/error";

export class CollectionNotFoundError extends CoreError {
  constructor() {
    super("Collection Not Found");
  }
}
