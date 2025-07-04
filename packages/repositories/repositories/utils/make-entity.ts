import {
  Changelog,
  Collection,
  Film,
  FilmType,
  NotifyUpdateType,
  Review,
  RoadmapItem,
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
  RoadmapSelects,
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
    UserSelects.UserSelectResult & {
      personalCollectionId: number | null;
      toWatchCollectionId: number | null;
    }
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
    type: rawData.personalCollectionId
      ? "personal"
      : rawData.toWatchCollectionId
        ? "watch"
        : "default",
  });
};

export const makeFilm = (rawData: FilmSelects.FilmSelectResult): Film => {
  return new Film({
    id: new Id(rawData["f-id"]),
    name: rawData["f-name"],
    filmLength: rawData["f-filmLength"],
    genres: rawData["f-genres"],
    posterPreviewUrl: rawData["f-posterPreviewUrl"],
    posterUrl: rawData["f-posterUrl"],
    year: rawData["f-year"],
    kinopoiskId: rawData["f-kinopoiskId"],
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

    isHidden: rawData["r-isHidden"],
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

const postgresArrayPattern = /\{([^}]+)\}/;
const parseArray = (v: string) =>
  v.match(postgresArrayPattern)?.at(1)?.split(",") ?? [];

export const makeUserPreferences = (
  rawData: UserPreferencesSelects.UserPreferencesSelectResult
): UserPreferences => {
  return new UserPreferences({
    id: new Id(rawData["up-id"]),
    userId: new Id(rawData["up-userId"]),
    notifyUpdateTypes: parseArray(rawData["up-notifyUpdateTypes"]).map(
      (v) => v as NotifyUpdateType
    ),
  });
};

export const makeRoadmapItem = (
  rawData: RoadmapSelects.RoadmapSelectResult
): RoadmapItem => {
  return new RoadmapItem({
    id: new Id(rawData["rm-id"]),
    description: rawData["rm-description"],
    title: rawData["rm-title"],
    orderNumber: rawData["rm-orderNumber"],
  });
};
