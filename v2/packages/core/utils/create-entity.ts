type EntityWithConstructor<T> = new (...args: any) => T;

/**
 * Builds a function that creates entity without ID
 * */
export const initCreateEntity =
  <T>(entityClass: EntityWithConstructor<T>) =>
  (props: Omit<T, "id">): Omit<T, "id"> => {
    return new entityClass(props);
  };
