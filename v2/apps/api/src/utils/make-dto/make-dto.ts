import { dtoRules, type PickableFields, type Transformer } from "./rules";
import { User, Collection, Review, Session, Film } from "@repo/core/entities";
import { Id } from "@repo/core/utils";

/** Utility type to map a type T to a new type K */
type TypeMap<T, K extends keyof T> = [T, { [P in K]: TransformedType<T[P]> }];

/** Defines the mappings for the types */
type SimpleMappings = [
  [Id, number],
  [Date, string],
  TypeMap<User, "id" | "username" | "createdAt" | "description" | "imageUrl">,
  TypeMap<
    Collection,
    | "id"
    | "name"
    | "creator"
    | "createdAt"
    | "updatedAt"
    | "description"
    | "imageUrl"
    | "isPublic"
  >,
  TypeMap<
    Review,
    | "id"
    | "description"
    | "userId"
    | "collectionId"
    | "film"
    | "score"
    | "createdAt"
    | "updatedAt"
  >,
  TypeMap<Session, "id" | "user" | "expiresAt">,
  TypeMap<
    Film,
    | "id"
    | "filmLength"
    | "genres"
    | "name"
    | "posterPreviewUrl"
    | "posterUrl"
    | "type"
    | "year"
  >,
];

/** Transforms the type T using the mappings M */
type TransformedType<T, M = SimpleMappings> = M extends [
  infer First,
  ...infer Rest,
]
  ? First extends [infer From, infer To]
    ? T extends From
      ? To
      : TransformedType<T, Rest>
    : never
  : T;

/** Handles nested objects and arrays */
type DtoTypeInternal<T> =
  T extends Array<infer U>
    ? DtoTypeInternal<U>[]
    : T extends object
      ? T extends SimpleMappings[number][0]
        ? TransformedType<T>
        : { [K in keyof T]: DtoTypeInternal<T[K]> }
      : T;

/** The type of the DTO based on entity */
export type DtoType<T> = DtoTypeInternal<T>;

type x = DtoType<{ c: Collection[] }>;

const isTransformer = (
  rule: PickableFields<unknown> | Transformer<unknown>
): rule is Transformer<unknown> => typeof rule === "function";

export function makeDto<T>(data: T): DtoType<T> {
  if (!data || typeof data !== "object") {
    return data as DtoType<T>;
  }

  if (Array.isArray(data)) {
    return data.map((item) => makeDto(item)) as DtoType<T>;
  }

  const constructor = data.constructor;
  const rule = dtoRules.get(constructor);

  if (!rule) {
    const result: Record<string, unknown> = {};

    for (const key in data) {
      const value = data[key];
      result[key] = makeDto(value);
    }

    return result as DtoType<T>;
  }

  if (isTransformer(rule)) {
    return rule(data) as DtoType<T>;
  }

  const result: Record<string, unknown> = {};

  for (const [key, include] of Object.entries(rule)) {
    if (!include) continue;

    const value = data[key as keyof T];
    result[key] = makeDto(value);
  }

  return result as DtoType<T>;
}

// TODO define types based on rules. There should not be two sources of truth.
