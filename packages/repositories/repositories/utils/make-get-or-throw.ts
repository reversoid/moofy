export class EntityNotFoundError extends Error {
  constructor() {
    super("Entity Not Found");
  }
}

/** Wraps get function to throw `EntityNotFoundError`
 * @throws EntityNotFoundError
 */
export const makeGetOrThrow = <I, O>(getFn: (id: I) => Promise<O | null>) => {
  return async (id: I) => {
    const entity = await getFn(id);

    if (!entity) {
      throw new EntityNotFoundError();
    }

    return entity;
  };
};
