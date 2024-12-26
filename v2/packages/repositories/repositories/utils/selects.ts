import { Selectable } from "kysely";
import { Database } from "../../db";

type ColumnAliasResult<
  TB extends keyof Database,
  Prefix extends string,
  Fields extends readonly (keyof Selectable<Database[TB]>)[],
> = {
  [K in Fields[number] as `${Prefix & string}_${K & string}`]: Selectable<
    Database[TB]
  >[K];
};

type MappedSelect<
  TB extends keyof Database,
  Prefix extends string,
  F extends keyof Selectable<Database[TB]>,
> = `${TB}.${F & string} as ${Prefix & string}_${F & string}`;

function getSelects<
  TB extends keyof Database,
  Prefix extends string,
  Fields extends ReadonlyArray<keyof Selectable<Database[TB]>>,
>(table: TB, prefix: Prefix, fields: Fields) {
  return fields.map(
    (field) => `${table}.${String(field)} as ${prefix}_${String(field)}`
  ) as {
    [Index in keyof Fields]: MappedSelect<TB, Prefix, Fields[Index]>;
  };
}

export namespace UserSelects {
  const userFields = [
    "id",
    "imageUrl",
    "createdAt",
    "description",
    "passwordHash",
    "updatedAt",
    "username",
  ] as const;

  const userPrefix = "u";

  export const userSelects = getSelects("users", userPrefix, userFields);

  export type UserSelectResult = ColumnAliasResult<
    "users",
    typeof userPrefix,
    typeof userFields
  >;
}

export namespace CollectionSelects {
  const collectionFields = [
    "id",
    "imageUrl",
    "createdAt",
    "description",
    "isPublic",
    "name",
    "updatedAt",
    "userId",
  ] as const;

  const collectionPrefix = "c";

  export const collectionSelects = getSelects(
    "collections",
    collectionPrefix,
    collectionFields
  );

  export type CollectionSelectResult = ColumnAliasResult<
    "collections",
    typeof collectionPrefix,
    typeof collectionFields
  >;
}

export namespace FilmSelects {
  const filmFields = [
    "createdAt",
    "filmLength",
    "genres",
    "id",
    "name",
    "posterPreviewUrl",
    "posterUrl",
    "type",
    "updatedAt",
    "year",
  ] as const;

  const filmPrefix = "f";

  export const filmSelects = getSelects("films", filmPrefix, filmFields);

  export type FilmSelectResult = ColumnAliasResult<
    "films",
    typeof filmPrefix,
    typeof filmFields
  >;
}

export namespace ReviewSelects {
  const reviewFields = [
    "collectionId",
    "createdAt",
    "description",
    "filmId",
    "id",
    "score",
    "updatedAt",
    "userId",
  ] as const;

  const reviewPrefix = "r";

  export const reviewSelects = getSelects(
    "reviews",
    reviewPrefix,
    reviewFields
  );

  export type ReviewSelectResult = ColumnAliasResult<
    "reviews",
    typeof reviewPrefix,
    typeof reviewFields
  >;
}
