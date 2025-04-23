import Sqids from "sqids";

export type PaginatedData<T> = {
  items: T[];
  cursor: string | null;
};

const sqids = new Sqids({ minLength: 0 });

const encodeCursor = (value: number): string => {
  return sqids.encode([value]);
};

const decodeCursor = (cursor: string): number => {
  return sqids.decode(cursor)[0];
};

/**
 * @description Make cursor from date.
 * @param date - Date to make cursor from.
 * @returns Cursor.
 */
export const makeCursorFromDate = (date: Date): string => {
  return encodeCursor(date.getTime());
};

/**
 * @description Make date from cursor.
 *
 * It adds 1ms to the date because pg stores microseconds, not ms, like js.
 * @param cursor - Cursor to make date from.
 * @returns Date.
 */
export const makeDateFromCursor = (cursor: string): Date => {
  return new Date(decodeCursor(cursor) + 1);
};

/**
 * Make cursor from number. Used for pagination using numeric sequence fields.
 */
export const makeCursorFromNumber = (value: number): string => {
  return encodeCursor(value);
};

/**
 * Make number from cursor. Used for pagination using numeric sequence fields.
 */
export const makeNumberFromCursor = (cursor: string): number => {
  return decodeCursor(cursor);
};
