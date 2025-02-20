export class Id {
  private _value: number | null = null;

  constructor(value?: number) {
    this._value = value ?? null;
  }

  public get value(): number {
    if (this._value === null) {
      throw new Error("ID Is Not Assigned. Something bad happenned.");
    }

    return this._value;
  }
}
