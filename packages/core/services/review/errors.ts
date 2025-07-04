import { CoreError } from "../../utils/error";

export class ReviewOnFilmExistsError extends CoreError {
  constructor() {
    super("Review On Film Already Exists");
  }
}

export class FilmNotFoundError extends CoreError {
  constructor() {
    super("Film Is Not Found");
  }
}

export class ReviewNotFoundError extends CoreError {
  constructor() {
    super("Review Is Not Found");
  }
}

export class NotOwnerOfReviewError extends CoreError {
  constructor() {
    super("User Is Not The Owner Of This Review");
  }
}

export class FilmAlreadyWatched extends CoreError {
  constructor() {
    super("Film Is Already Watched");
  }
}

export class FilmIsNotWatched extends CoreError {
  constructor() {
    super("Film Is Not Watched");
  }
}
