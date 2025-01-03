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
    passwordHash: rawData.u_passwordHash,
    username: rawData.u_username,
    createdAt: rawData.u_createdAt,
    description: rawData.u_description,
    id: new Id(rawData.u_id),
    imageUrl: rawData.u_imageUrl,
    updatedAt: rawData.u_updatedAt,
  });
};

export const makeCollection = (
  rawData: CollectionSelects.CollectionSelectResult &
    UserSelects.UserSelectResult
): Collection => {
  return new Collection({
    id: new Id(rawData.c_id),
    name: rawData.c_name,
    description: rawData.c_description,
    creator: makeUser(rawData),
    isPublic: rawData.c_isPublic,
    imageUrl: rawData.c_imageUrl,
    createdAt: rawData.c_createdAt,
    updatedAt: rawData.c_updatedAt,
  });
};

export const makeFilm = (rawData: FilmSelects.FilmSelectResult): Film => {
  return new Film({
    id: rawData.f_id,
    name: rawData.f_name,
    filmLength: rawData.f_filmLength,
    genres: rawData.f_genres,
    posterPreviewUrl: rawData.f_posterPreviewUrl,
    posterUrl: rawData.f_posterUrl,
    year: rawData.f_year,
    type: FilmType[rawData.f_type],
  });
};

export const makeReview = (
  rawData: ReviewSelects.ReviewSelectResult & FilmSelects.FilmSelectResult
): Review => {
  return new Review({
    collectionId: new Id(rawData.r_collectionId),
    film: makeFilm(rawData),
    createdAt: rawData.r_createdAt,
    description: rawData.r_description,
    id: new Id(rawData.r_id),
    score: rawData.r_score,
    updatedAt: rawData.r_updatedAt,
    userId: new Id(rawData.r_userId),
  });
};

export const makeSession = (
  rawData: SessionSelects.SessionSelectResult & UserSelects.UserSelectResult
): Session => {
  return new Session({
    id: rawData.s_id,
    expiresAt: rawData.s_expiresAt,
    user: makeUser(rawData),
  });
};
