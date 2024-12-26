import { Collection, Film, FilmType, Review, User } from "@repo/core/entities";
import { Id } from "@repo/core/utils";
import {
  CollectionSelects,
  FilmSelects,
  ReviewSelects,
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
  collectionData: CollectionSelects.CollectionSelectResult,
  userData: UserSelects.UserSelectResult
): Collection => {
  return new Collection({
    id: new Id(collectionData.c_id),
    name: collectionData.c_name,
    description: collectionData.c_description,
    creator: makeUser(userData),
    isPublic: collectionData.c_isPublic,
    imageUrl: collectionData.c_imageUrl,
    createdAt: collectionData.c_createdAt,
    updatedAt: collectionData.c_updatedAt,
  });
};

export const makeFilm = (filmData: FilmSelects.FilmSelectResult): Film => {
  return new Film({
    id: filmData.f_id,
    name: filmData.f_name,
    filmLength: filmData.f_filmLength,
    genres: filmData.f_genres,
    posterPreviewUrl: filmData.f_posterPreviewUrl,
    posterUrl: filmData.f_posterUrl,
    year: filmData.f_year,
    type: FilmType[filmData.f_type],
  });
};

export const makeReview = (
  reviewData: ReviewSelects.ReviewSelectResult,
  filmData: FilmSelects.FilmSelectResult
): Review => {
  return new Review({
    collectionId: new Id(reviewData.r_collectionId),
    film: makeFilm(filmData),
    createdAt: reviewData.r_createdAt,
    description: reviewData.r_description,
    id: new Id(reviewData.r_id),
    score: reviewData.r_score,
    updatedAt: reviewData.r_updatedAt,
  });
};
