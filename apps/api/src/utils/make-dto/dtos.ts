import {
  makeReviewDto,
  makeFilmDto,
  makeSessionDto,
  makeCollectionDto,
  makeTagDto,
  makeUserDto,
  makeChangelogDto,
} from "./make-dto";

export type TagDto = ReturnType<typeof makeTagDto>;
export type UserDto = ReturnType<typeof makeUserDto>;
export type CollectionDto = ReturnType<typeof makeCollectionDto>;
export type ReviewDto = ReturnType<typeof makeReviewDto>;
export type SessionDto = ReturnType<typeof makeSessionDto>;
export type FilmDto = ReturnType<typeof makeFilmDto>;
export type ChangelogDto = ReturnType<typeof makeChangelogDto>;
