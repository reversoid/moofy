import {
  User,
  Collection,
  Review,
  Session,
  Film,
  Tag,
} from "@repo/core/entities";
import { Id, PaginatedData } from "@repo/core/utils";

export const makeIdDto = (id: Id) => id.value;

export const makeDateDto = (date: Date) => date.toISOString();

export const makeUserDto = (user: User) => ({
  id: user.id.value,
  username: user.username,
  description: user.description,
  imageUrl: user.imageUrl,
  createdAt: makeDateDto(user.createdAt),
});

export const makeCollectionDto = (collection: Collection) => ({
  id: collection.id.value,
  name: collection.name,
  description: collection.description,
  imageUrl: collection.imageUrl,
  isPublic: collection.isPublic,
  createdAt: makeDateDto(collection.createdAt),
  updatedAt: makeDateDto(collection.updatedAt),
  creator: makeUserDto(collection.creator),
});

export const makeFilmDto = (film: Film) => ({
  id: film.id,
  name: film.name,
  posterPreviewUrl: film.posterPreviewUrl,
  posterUrl: film.posterUrl,
  type: film.type,
  year: film.year,
});

export const makeTagDto = (tag: Tag) => ({
  id: tag.id.value,
  name: tag.name,
  hexColor: tag.hexColor,
  createdAt: makeDateDto(tag.createdAt),
});

export const makeReviewDto = (review: Review) => ({
  id: review.id.value,
  description: review.description,
  score: review.score,
  tags: review.tags.map(makeTagDto),
  film: makeFilmDto(review.film),
  createdAt: makeDateDto(review.createdAt),
  updatedAt: makeDateDto(review.updatedAt),
});

export const makeSessionDto = (session: Session) => ({
  id: session.id,
  user: makeUserDto(session.user),
  expiresAt: makeDateDto(session.expiresAt),
});

export const withPaginatedData =
  <I, O>(transformer: (entity: I) => O) =>
  (data: PaginatedData<I>) => ({
    cursor: data.cursor,
    items: data.items.map(transformer),
  });
