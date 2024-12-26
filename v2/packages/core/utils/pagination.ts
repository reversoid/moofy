import Sqids from "sqids";

export type PaginatedData<T> = {
  items: T[];
  cursor: string | null;
};

const sqids = new Sqids({ minLength: 0 });

export const encodeCursor = (value: number): string => {
  return sqids.encode([value]);
};

export const decodeCursor = (cursor: string): number => {
  return sqids.decode(cursor)[0];
};
