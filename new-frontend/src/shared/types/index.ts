export interface PaginatedData<T> {
  nextKey: string | null;
  items: T[];
}

export * from './collection';
export * from './comment';
export * from './notification';
export * from './profile';
export * from './review';
export * from './user';
