import {
  Collection,
  Film,
  FilmType,
  Review,
  Session,
  User,
} from "@repo/core/entities";
import { Id } from "@repo/core/utils";
import {
  CollectionSelects,
  FilmSelects,
  ReviewSelects,
  SessionSelects,
  UserSelects,
} from "./selects";

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
  rawData: ReviewSelects.ReviewSelectResult & FilmSelects.FilmSelectResult
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
