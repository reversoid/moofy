export interface IterableResponse<T> {
  nextKey: Date | null;
  items: T[];
}
