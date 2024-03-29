/** Describes floating point number */
export type RankValue = string

/** Describes ISO Date */
export type DateAsString = string;

export type Id = number;

export interface ApiError {
  statusCode: number;
  message: string;
}

export interface FetchError {
  cause: ApiError;
}

export interface IterableResponse<T> {
  /**Represents a date */
  nextKey: DateAsString | null;
  items: T[];
}

export interface SearchResponse<T> {
  /**Represents a next rank value */
  nextKey: string;
  items: T[];
}
