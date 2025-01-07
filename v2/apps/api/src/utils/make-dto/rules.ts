import { Collection, Film, Review, Session, User } from "@repo/core/entities";
import { Id } from "@repo/core/utils";

export type PickableFields<T> = {
  [K in keyof T]?: boolean | PickableFields<T[keyof T]>;
};

export type Transformer<T> = (value: T) => unknown;

const registerTransformer = <T>(
  type: new (...args: any[]) => T,
  transformer: Transformer<T>
) => [type, transformer] as const;

const registerFields = <T extends object>(
  type: new (...args: any[]) => T,
  fields: PickableFields<T>
) => [type, fields] as const;

const getRules = (
  ...rules: ReturnType<typeof registerTransformer | typeof registerFields>[]
) => {
  return new Map<Function, PickableFields<unknown> | Transformer<unknown>>(
    rules
  );
};

export const dtoRules = getRules(
  registerTransformer(Id, (id) => id.value),
  registerTransformer(Date, (date) => date.toISOString()),

  registerFields(User, {
    id: true,
    username: true,
    createdAt: true,
    description: true,
    imageUrl: true,
  }),

  registerFields(Collection, {
    id: true,
    name: true,
    description: true,
    createdAt: true,
    creator: true,
    imageUrl: true,
    isPublic: true,
    updatedAt: true,
  }),

  registerFields(Session, {
    id: true,
    user: true,
    expiresAt: true,
  }),

  registerFields(Review, {
    id: true,
    createdAt: true,
    updatedAt: true,
    collectionId: true,
    description: true,
    film: true,
    score: true,
  }),

  registerFields(Film, {
    id: true,
    filmLength: true,
    genres: true,
    name: true,
    posterPreviewUrl: true,
    type: true,
    year: true,
    posterUrl: true,
  })
);
