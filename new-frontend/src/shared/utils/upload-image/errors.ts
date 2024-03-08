export class ImageTooLargeError extends Error {
  constructor() {
    super('IMAGE_TOO_LARGE');
  }
}

export class ImageWrongFormatError extends Error {
  constructor() {
    super('IMAGE_WRONG_FORMAT');
  }
}
