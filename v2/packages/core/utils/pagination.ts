export type PaginatedData<T> = {
  items: T[];
  cursor: string | null;
};
