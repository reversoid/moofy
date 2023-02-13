export type DateAsString = string;

export interface ApiError {
  code: number;
  message: string;
}

export interface IterableResponse<T> {
  /**Represents a date */
  nextKey: DateAsString | null;
  items: T[];
}
