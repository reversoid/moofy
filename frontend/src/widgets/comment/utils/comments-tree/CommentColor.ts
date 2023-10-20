export class CommentColor {
  constructor(color?: string | null, prevColor?: string | null) {
    this.currentColorHex = color ?? null;
    this.prevColorHex = prevColor ?? null;
  }

  public currentColorHex: string | null = null;
  private prevColorHex: string | null = null;

  /** Clears color. Sets the latest color value if it were specified */
  public clearColor() {
    this.currentColorHex = this.prevColorHex;
    this.prevColorHex = null;
  }

  /** Get latest color */
  public setColor(color: string) {
    this.prevColorHex = this.currentColorHex;
    this.currentColorHex = color;
  }

  public copy() {
    return new CommentColor(this.currentColorHex, this.prevColorHex);
  }

  public toString() {
    return this.currentColorHex ?? '';
  }
}
