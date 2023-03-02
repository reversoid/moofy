export interface Environment {
  /** Backend url */
  apiUrl: string;

  /** Amount of times **App.tsx** is mounted */
  RERENDER_AMOUNT: 1 | 2;
}
