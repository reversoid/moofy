import {
  Changelog,
  Collection,
  Film,
  FilmType,
  NotifyUpdateType,
  Review,
  Session,
  Tag,
  User,
  UserPreferences,
} from "@repo/core/entities";
import { Id } from "@repo/core/utils";
import {
  ChangelogSelects,
  CollectionSelects,
  CollectionTagSelects,
  FilmSelects,
  ReviewSelects,
  SessionSelects,
  UserPreferencesSelects,
  UserSelects,
} from "./selects";
import type { TagData } from "../review.repository";

export const makeUser = (rawData: UserSelects.UserSelectResult): User => {
  return new User({
    passwordHash: rawData["u-passwordHash"],
    username: rawData["u-username"],
    createdAt: rawData["u-createdAt"],
    description: rawData["u-description"],
    id: new Id(rawData["u-id"]),
    imageUrl: rawData["u-imageUrl"],
    updatedAt: rawData["u-updatedAt"],
  });
};

export const makeCollection = (
  rawData: CollectionSelects.CollectionSelectResult &
    UserSelects.UserSelectResult
): Collection => {
  return new Collection({
    id: new Id(rawData["c-id"]),
    name: rawData["c-name"],
    description: rawData["c-description"],
    creator: makeUser(rawData),
    isPublic: rawData["c-isPublic"],
    imageUrl: rawData["c-imageUrl"],
    createdAt: rawData["c-createdAt"],
    updatedAt: rawData["c-updatedAt"],
  });
};

export const makeFilm = (rawData: FilmSelects.FilmSelectResult): Film => {
  return new Film({
    id: rawData["f-id"],
    name: rawData["f-name"],
    filmLength: rawData["f-filmLength"],
    genres: rawData["f-genres"],
    posterPreviewUrl: rawData["f-posterPreviewUrl"],
    posterUrl: rawData["f-posterUrl"],
    year: rawData["f-year"],
    type: FilmType[rawData["f-type"]],
  });
};

export const makeReview = (
  rawData: ReviewSelects.ReviewSelectResult &
    FilmSelects.FilmSelectResult & { tags: TagData[] | null }
): Review => {
  return new Review({
    collectionId: new Id(rawData["r-collectionId"]),
    film: makeFilm(rawData),
    createdAt: rawData["r-createdAt"],
    description: rawData["r-description"],
    id: new Id(rawData["r-id"]),
    score: rawData["r-score"],
    updatedAt: rawData["r-updatedAt"],
    userId: new Id(rawData["r-userId"]),

    tags: rawData["tags"]?.map(
      (t) =>
        new Tag({
          collectionId: new Id(t.collectionId),
          createdAt: new Date(t.createdAt),
          hexColor: t.hexColor,
          id: new Id(t.id),
          name: t.name,
        })
    ),
  });
};

export const makeSession = (
  rawData: SessionSelects.SessionSelectResult & UserSelects.UserSelectResult
): Session => {
  return new Session({
    id: rawData["s-id"],
    expiresAt: rawData["s-expiresAt"],
    user: makeUser(rawData),
  });
};

export const makeTag = (
  rawData: CollectionTagSelects.CollectionTagSelectResult
): Tag => {
  return new Tag({
    id: new Id(rawData["ct-id"]),
    collectionId: new Id(rawData["ct-collectionId"]),
    name: rawData["ct-name"],
    hexColor: rawData["ct-hexColor"],
    createdAt: rawData["ct-createdAt"],
  });
};

export const makeChangelog = (
  rawData: ChangelogSelects.ChangelogSelectResult
): Changelog => {
  return new Changelog({
    id: new Id(rawData["cl-id"]),
    description: rawData["cl-description"],
    hasBugfix: rawData["cl-hasBugfix"],
    hasFeature: rawData["cl-hasFeature"],
    hasImprovement: rawData["cl-hasImprovement"],
    releaseDate: rawData["cl-releaseDate"],
    version: rawData["cl-version"],
    createdAt: rawData["cl-createdAt"],
  });
};

export const makeUserPreferences = (
  rawData: UserPreferencesSelects.UserPreferencesSelectResult
): UserPreferences => {
  return new UserPreferences({
    id: new Id(rawData["up-id"]),
    userId: new Id(rawData["up-userId"]),
    notifyUpdateTypes: rawData["up-notifyUpdateTypes"].map(
      (v) => NotifyUpdateType[v]
    ),
  });
};
