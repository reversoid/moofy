import { CoreError } from "../../utils";

export class ImageTooLargeError extends CoreError {
  constructor() {
    super("Image Too Large");
  }
}

export class WrongFileTypeError extends CoreError {
  constructor() {
    super("Wrong File Type");
  }
}

export class BrokenImageError extends CoreError {
  constructor() {
    super("Broken Image");
  }
}
