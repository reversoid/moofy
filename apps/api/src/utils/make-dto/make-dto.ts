import {
  User,
  Collection,
  Review,
  Session,
  Film,
  Tag,
  Changelog,
  UserPreferences,
  RoadmapItem,
  FilmType,
} from "@repo/core/entities";
import { ProviderFilmDto } from "@repo/core/film-providers";
import { Id, PaginatedData } from "@repo/core/utils";

export const withPaginatedData =
  <I, O>(transformer: (entity: I) => O) =>
  (data: PaginatedData<I>) => ({
    cursor: data.cursor,
    items: data.items.map(transformer),
  });

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
  type: collection.type,
});

export const makeFilmTypeDto = (filmType: FilmType) =>
  `${filmType}` as `${FilmType}`;

export const makeFilmDto = (film: Film) => ({
  id: film.id.value,
  name: film.name,
  posterPreviewUrl: film.posterPreviewUrl,
  posterUrl: film.posterUrl,
  type: makeFilmTypeDto(film.type),
  year: film.year,
  kinopoiskId: film.kinopoiskId,
  genres: film.genres,
});

export const makeProviderFilmDto = (film: ProviderFilmDto) => ({
  id: film.kinopoiskId,
  name: film.name,
  posterPreviewUrl: film.posterPreviewUrl,
  posterUrl: film.posterUrl,
  type: film.type,
  year: film.year,
  genres: film.genres,
});

export const makeTagDto = (tag: Tag) => ({
  id: tag.id.value,
  name: tag.name,
  hexColor: tag.hexColor,
  createdAt: makeDateDto(tag.createdAt),
  description: tag.description,
});

export const makeReviewDto = (review: Review) => ({
  id: review.id.value,
  description: review.description,
  score: review.score,
  tags: review.tags.map(makeTagDto),
  film: makeFilmDto(review.film),
  createdAt: makeDateDto(review.createdAt),
  updatedAt: makeDateDto(review.updatedAt),
  isHidden: review.isHidden,
});

export const makeSessionDto = (session: Session) => ({
  id: session.id,
  user: makeUserDto(session.user),
  expiresAt: makeDateDto(session.expiresAt),
});

export const makeChangelogDto = (changelog: Changelog) => ({
  id: changelog.id.value,
  description: changelog.description,
  createdAt: changelog.createdAt,
  releaseDate: changelog.releaseDate,
  version: changelog.version,
  hasBugfix: changelog.hasBugfix,
  hasImprovement: changelog.hasImprovement,
  hasFeature: changelog.hasFeature,
});

export const makePreferencesDto = (preferences: UserPreferences) => ({
  id: preferences.id.value,
  notifyUpdateType: preferences.notifyUpdateTypes.map((v) => `${v}` as const),
});

export const makeRoadmapItemDto = (roadmap: RoadmapItem) => ({
  id: roadmap.id.value,
  orderNumber: roadmap.orderNumber,
  title: roadmap.title,
  description: roadmap.description,
});
