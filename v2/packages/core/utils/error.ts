export class CoreError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

/** This Error Is One That Must Never Happen. Only Used For Typechecking */
export class WeirdUpdateError extends CoreError {
  constructor() {
    super("Item Updated But Not Found When Returned");
  }
}

/** This Error Is One That Must Never Happen. Only Used For Typechecking */
export class WeirdCreateError extends CoreError {
  constructor() {
    super("Item Created But Not Found When Returned");
  }
}
