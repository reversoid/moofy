import { Selectable } from "kysely";
import { Database } from "../../db";

// TODO can be done better without namespaces? just using functions? or classes?

type ColumnAliasResult<
  TB extends keyof Database,
  Prefix extends string,
  Fields extends readonly (keyof Selectable<Database[TB]>)[],
> = {
  [K in Fields[number] as `${Prefix & string}-${K & string}`]: Selectable<
    Database[TB]
  >[K];
};

type MappedSelect<
  TB extends keyof Database,
  Prefix extends string,
  F extends keyof Selectable<Database[TB]>,
> = `${TB}.${F & string} as ${Prefix & string}-${F & string}`;

function getSelects<
  TB extends keyof Database,
  Prefix extends string,
  Fields extends ReadonlyArray<keyof Selectable<Database[TB]>>,
>(table: TB, prefix: Prefix, fields: Fields) {
  return fields.map(
    (field) => `${table}.${String(field)} as ${prefix}-${String(field)}`
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
    "kinopoiskId",
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

export namespace SessionSelects {
  const sessionFields = ["id", "expiresAt", "userId"] as const;

  const sessionPrefix = "s";

  export const sessionSelects = getSelects(
    "sessions",
    sessionPrefix,
    sessionFields
  );

  export type SessionSelectResult = ColumnAliasResult<
    "sessions",
    typeof sessionPrefix,
    typeof sessionFields
  >;
}

export namespace CollectionTagSelects {
  const collectionTagFields = [
    "id",
    "collectionId",
    "name",
    "hexColor",
    "createdAt",
  ] as const;

  const collectionTagPrefix = "ct";

  export const collectionTagSelects = getSelects(
    "collectionTags",
    collectionTagPrefix,
    collectionTagFields
  );

  export type CollectionTagSelectResult = ColumnAliasResult<
    "collectionTags",
    typeof collectionTagPrefix,
    typeof collectionTagFields
  >;
}

export namespace ChangelogSelects {
  const changelogFields = [
    "id",
    "description",
    "releaseDate",
    "hasBugfix",
    "hasFeature",
    "hasImprovement",
    "version",
    "createdAt",
  ] as const;

  const changelogPrefix = "cl";

  export const changelogSelects = getSelects(
    "changelogs",
    changelogPrefix,
    changelogFields
  );

  export type ChangelogSelectResult = ColumnAliasResult<
    "changelogs",
    typeof changelogPrefix,
    typeof changelogFields
  >;
}

export namespace UserPreferencesSelects {
  const userPreferencesFields = ["id", "userId", "notifyUpdateTypes"] as const;

  const userPreferencesPrefix = "up";

  export const userPreferencesSelects = getSelects(
    "userPreferences",
    userPreferencesPrefix,
    userPreferencesFields
  );

  export type UserPreferencesSelectResult = ColumnAliasResult<
    "userPreferences",
    typeof userPreferencesPrefix,
    typeof userPreferencesFields
  >;
}
