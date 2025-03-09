import { Collection, Film, Review, Session, User } from "@repo/core/entities";
import { DtoType } from "./make-dto";

export type UserDto = DtoType<User>;
export type CollectionDto = DtoType<Collection>;
export type ReviewDto = DtoType<Review>;
export type SessionDto = DtoType<Session>;
export type FilmDto = DtoType<Film>;
