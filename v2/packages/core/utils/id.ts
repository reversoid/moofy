export class Id {
  private _value: number;

  constructor(value: number) {
    this._value = Id.validateId(value);
  }

  public get value() {
    return this._value;
  }

  public static validateId(value: number): number {
    if (typeof value !== "number") {
      throw new Error("Id Must Be A Number");
    }

    return value;
  }

  toNumber() {
    return this.value;
  }
}
