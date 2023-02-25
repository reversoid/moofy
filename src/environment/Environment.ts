export interface Environment {
  /** Backend url */
  apiUrl: string;

  /** Amount of times **App.tsx** is mounted */
  RERENDER_AMOUNT: number;
}
