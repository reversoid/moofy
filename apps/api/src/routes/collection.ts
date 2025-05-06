import { FilmType } from "@repo/core/entities";
import {
  AlreadyLikedCollectionError,
  CollectionNotFoundError,
  DeleteLinkedPersonalCollectionError,
  FilmNotFoundError,
  NoAccessToCollectionError,
  NoAccessToPrivateCollectionError,
  NotLikedCollectionError,
  NotOwnerOfCollectionError,
  ReviewOnFilmExistsError,
  TagAlreadyExistsError,
  TagNotFoundError,
  UserNotFoundError,
} from "@repo/core/services";
import { Id } from "@repo/core/utils";
import { Hono } from "hono";
import { z } from "zod";
import { authMiddleware } from "../utils/auth-middleware";
import {
  makeCollectionDto,
  makeReviewDto,
  makeTagDto,
  withPaginatedData,
} from "../utils/make-dto";
import { validator } from "../utils/validator";
import { dayjs } from "@repo/core/sdk";

const hexColorSchema = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color format.");

type Value<T> = [T];
type Range<T> = [T, T];
type RangeOrValue<T> = Range<T> | Value<T>;

const parseComarableFieldString = <T>(
  raw: string,
  convertFn: (value: string) => T
): RangeOrValue<T> => {
  // v has format value or value1-value2
  const [v1, v2] = raw.split("-") as [string, string | undefined];

  if (!v2) {
    return [convertFn(v1)];
  }

  return [convertFn(v1), convertFn(v2)];
};

const parseComparableNumberField = (raw: string) => {
  return parseComarableFieldString(raw, (v) =>
    z.coerce.number().int().parse(v)
  );
};

const parseComparableDateField = (raw: string) => {
  return parseComarableFieldString(raw, (v) => z.coerce.date().parse(v));
};

export const collectionRoute = new Hono()
  .get(
    "",
    validator(
      "query",
      z.object({
        search: z.string().default(""),
        limit: z.coerce.number().int().min(1).max(100).default(20),
      })
    ),
    async (c) => {
      const { search, limit } = c.req.valid("query");
      const collectionService = c.get("collectionService");

      const collections = await collectionService.searchPublicCollections({
        search,
        limit,
      });

      return c.json({ collections: collections.map(makeCollectionDto) });
    }
  )
  .post(
    "",
    authMiddleware,
    validator(
      "json",
      z.object({
        name: z.string().min(1),
        description: z.string().nullable().optional(),
        imageUrl: z.string().nullable().optional(),
        isPublic: z.boolean().default(false),
      })
    ),
    async (c) => {
      const { user } = c.get("session")!;
      const { name, description, imageUrl, isPublic } = c.req.valid("json");
      const collectionService = c.get("collectionService");

      const result = await collectionService.createCollection({
        userId: user.id,
        dto: {
          name,
          description: description ?? undefined,
          imageUrl: imageUrl ?? undefined,
          isPublic,
        },
      });

      return c.json({ collection: makeCollectionDto(result.unwrap()) }, 201);
    }
  )
  .post(
    "/:collectionId/views",
    authMiddleware,
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const session = c.get("session")!;
      const collectionService = c.get("collectionService");

      const result = await collectionService.viewCollection({
        collectionId: new Id(collectionId),
        userId: session.user.id,
      });

      if (result.isErr()) {
        if (result.error instanceof UserNotFoundError) {
          return c.json({ error: "USER_NOT_FOUND" as const }, 404);
        }

        if (result.error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (result.error instanceof NoAccessToPrivateCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        throw result.error;
      }

      return c.body(null, 204);
    }
  )
  .get(
    "/:collectionId",
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const session = c.get("session");
      const collectionService = c.get("collectionService");

      const collectionResult = await collectionService.getCollection({
        id: new Id(collectionId),
        by: session?.user?.id,
      });

      if (collectionResult.isErr()) {
        const error = collectionResult.unwrapErr();

        if (error instanceof NoAccessToPrivateCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        throw error;
      }

      const collection = collectionResult.unwrap();

      if (!collection) {
        return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
      }

      return c.json({ collection: makeCollectionDto(collection) }, 200);
    }
  )
  .delete(
    "/:collectionId",
    authMiddleware,
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const session = c.get("session")!;
      const collectionService = c.get("collectionService");

      const result = await collectionService.removeCollection({
        id: new Id(collectionId),
        by: session.user.id,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NotOwnerOfCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        if (error instanceof DeleteLinkedPersonalCollectionError) {
          return c.json(
            { error: "CANNOT_DELETE_LINKED_PERSONAL_COLLECTION" as const },
            403
          );
        }

        throw error;
      }

      return c.body(null, 204);
    }
  )
  .patch(
    "/:collectionId",
    authMiddleware,
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    validator(
      "json",
      z.object({
        name: z.string().min(1).optional(),
        description: z.string().nullable().optional(),
        imageUrl: z.string().nullable().optional(),
        isPublic: z.boolean().optional(),
        updatePosition: z.boolean().optional(),
      })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const { updatePosition, ...updateData } = c.req.valid("json");
      const session = c.get("session")!;
      const collectionService = c.get("collectionService");

      const result = await collectionService.editCollection({
        id: new Id(collectionId),
        by: session.user.id,
        dto: updateData,
        updatePosition,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NotOwnerOfCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        throw error;
      }

      return c.json({ collection: makeCollectionDto(result.unwrap()) });
    }
  )
  .get(
    "/:collectionId/reviews",
    validator(
      "query",
      z.object({
        limit: z.coerce.number().int().min(1).max(100).default(20),
        search: z.string().optional(),
        cursor: z.string().optional(),
        type: z
          .string()
          .transform((v) => v.split(","))
          .refine(
            (types) =>
              new Set(types).intersection(
                new Set([
                  "FILM",
                  "TV_SERIES",
                  "TV_SHOW",
                  "MINI_SERIES",
                  "VIDEO",
                ])
              ).size === types.length
          )
          .optional(),
        genres: z
          .string()
          .transform((v) => v.split(","))
          .optional(),
        tagId: z
          .array(z.coerce.number().int())
          .or(z.coerce.number().int())
          .transform((v) => (Array.isArray(v) ? v : [v]))
          .optional(),
        length: z
          .array(z.string().transform(parseComparableNumberField))
          .or(z.string().transform((v) => [parseComparableNumberField(v)]))
          .optional(),
        year: z
          .array(z.string().transform(parseComparableNumberField))
          .or(z.string().transform((v) => [parseComparableNumberField(v)]))
          .optional(),
        createdAt: z
          .array(z.string().transform(parseComparableDateField))
          .or(z.string().transform((v) => [parseComparableDateField(v)]))
          .optional(),
        updatedAt: z
          .array(z.string().transform(parseComparableDateField))
          .or(z.string().transform((v) => [parseComparableDateField(v)]))
          .optional(),
      })
    ),
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const session = c.get("session");

      const { collectionId } = c.req.valid("param");
      const {
        limit,
        cursor,
        search,
        genres,
        tagId,
        type,
        createdAt,
        length,
        updatedAt,
        year,
      } = c.req.valid("query");

      const reviewService = c.get("reviewService");

      const result = await reviewService.getCollectionReviews({
        collectionId: new Id(collectionId),
        limit,
        cursor,
        by: session?.user?.id,
        search,
        filters: {
          genres: genres,
          tagsIds: tagId?.map((t) => new Id(Number(t))),
          type: type?.map((t) => t as FilmType),

          year: year?.map(([from, to]) => ({ from, to: to ?? from })),

          filmLength: length?.map(([from, to]) => ({ from, to: to ?? from })),

          createdAt: createdAt?.map(([from, to]) => ({
            from: dayjs(from).startOf("day").toDate(),
            to: dayjs(to ?? from)
              .endOf("day")
              .toDate(),
          })),

          updatedAt: updatedAt?.map(([from, to]) => ({
            from: dayjs(from).startOf("day").toDate(),
            to: dayjs(to ?? from)
              .endOf("day")
              .toDate(),
          })),
        },
      });

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NoAccessToPrivateCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        throw error;
      }

      const reviews = result.unwrap();
      return c.json({ reviews: withPaginatedData(makeReviewDto)(reviews) });
    }
  )
  .post(
    "/:collectionId/reviews",
    authMiddleware,
    validator(
      "json",
      z.object({
        score: z.number().int().min(1).max(5).nullish(),
        description: z.string().min(1).max(400).nullish(),
        filmId: z.coerce.number().int().positive(),
        isHidden: z.boolean().optional(),
      })
    ),
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const { score, description, filmId, isHidden } = c.req.valid("json");
      const session = c.get("session")!;

      const reviewService = c.get("reviewService");

      const result = await reviewService.createReview({
        collectionId: new Id(collectionId),
        by: session.user.id,
        dto: {
          filmId: String(filmId),
          score: score ?? undefined,
          description: description ?? undefined,
          isHidden,
        },
      });

      if (result.isErr()) {
        const error = result.unwrapErr();

        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof FilmNotFoundError) {
          return c.json({ error: "FILM_NOT_FOUND" as const }, 400);
        }

        if (error instanceof ReviewOnFilmExistsError) {
          return c.json({ error: "REVIEW_ON_FILM_EXISTS" as const }, 409);
        }

        if (error instanceof NoAccessToCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        throw error;
      }

      const review = result.unwrap();
      return c.json({ review: makeReviewDto(review) }, 201);
    }
  )
  .put(
    "/:collectionId/likes",
    authMiddleware,
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const session = c.get("session")!;
      const collectionService = c.get("collectionService");

      const result = await collectionService.likeCollection({
        collectionId: new Id(collectionId),
        userId: session.user.id,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();

        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NoAccessToPrivateCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        if (error instanceof AlreadyLikedCollectionError) {
          return c.json({ error: "ALREADY_LIKED" as const }, 409);
        }

        throw error;
      }

      return c.body(null, 204);
    }
  )
  .delete(
    "/:collectionId/likes",
    authMiddleware,
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const session = c.get("session")!;
      const collectionService = c.get("collectionService");

      const result = await collectionService.unlikeCollection({
        collectionId: new Id(collectionId),
        userId: session.user.id,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();

        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NoAccessToPrivateCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        if (error instanceof NotLikedCollectionError) {
          return c.json({ error: "NOT_LIKED" as const }, 409);
        }

        throw error;
      }

      return c.body(null, 204);
    }
  )
  .get(
    "/:collectionId/socials",
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const session = c.get("session");
      const collectionService = c.get("collectionService");

      const socialsResult = await collectionService.getSocials({
        collectionId: new Id(collectionId),
        by: session?.user?.id,
      });

      if (socialsResult.isErr()) {
        const error = socialsResult.unwrapErr();
        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NoAccessToPrivateCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        throw error;
      }

      const socials = socialsResult.unwrap();

      return c.json({ socials }, 200);
    }
  )
  .get(
    "/:collectionId/tags",
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const session = c.get("session");
      const tagService = c.get("tagService");

      const result = await tagService.getTagsByCollectionId({
        collectionId: new Id(collectionId),
        by: session?.user.id,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NoAccessToPrivateCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        throw error;
      }

      const tags = result.unwrap();
      return c.json({ tags: tags.map(makeTagDto) });
    }
  )
  .put(
    "/:collectionId/tags",
    authMiddleware,
    validator(
      "param",
      z.object({ collectionId: z.coerce.number().int().positive() })
    ),
    validator(
      "json",
      z.object({
        name: z.string().min(1).max(32),
        hexColor: hexColorSchema,
        description: z.string().nullable().optional(),
      })
    ),
    async (c) => {
      const { collectionId } = c.req.valid("param");
      const { hexColor, name, description } = c.req.valid("json");
      const session = c.get("session")!;
      const tagService = c.get("tagService");

      const result = await tagService.createCollectionTag({
        collectionId: new Id(collectionId),
        by: session.user.id,
        dto: { hexColor, name, description: description ?? null },
      });

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof CollectionNotFoundError) {
          return c.json({ error: "COLLECTION_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NotOwnerOfCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        if (error instanceof TagAlreadyExistsError) {
          return c.json({ error: "TAG_ALREADY_EXISTS" as const }, 409);
        }

        throw error;
      }

      const tag = result.unwrap();
      return c.json({ tag: makeTagDto(tag) }, 201);
    }
  )
  .delete(
    "/:collectionId/tags/:tagId",
    authMiddleware,
    validator(
      "param",
      z.object({
        collectionId: z.coerce.number().int().positive(),
        tagId: z.coerce.number().int().positive(),
      })
    ),
    async (c) => {
      const { tagId } = c.req.valid("param");
      const session = c.get("session")!;
      const tagService = c.get("tagService");

      const result = await tagService.deleteTag({
        tagId: new Id(tagId),
        by: session.user.id,
      });

      if (result.isErr()) {
        const error = result.unwrapErr();

        if (error instanceof NotOwnerOfCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        if (error instanceof TagNotFoundError) {
          return c.json({ error: "TAG_NOT_FOUND" as const }, 404);
        }

        throw error;
      }

      return c.body(null, 204);
    }
  )
  .patch(
    "/:collectionId/tags/:tagId",
    authMiddleware,
    validator(
      "param",
      z.object({
        collectionId: z.coerce.number().int().positive(),
        tagId: z.coerce.number().int().positive(),
      })
    ),
    validator(
      "json",
      z.object({
        name: z.string().min(1).max(32).optional(),
        hexColor: hexColorSchema.optional(),
        description: z.string().nullable().optional(),
      })
    ),
    async (c) => {
      const { tagId } = c.req.valid("param");
      const { hexColor, name, description } = c.req.valid("json");
      const session = c.get("session")!;
      const tagService = c.get("tagService");

      const result = await tagService.editTag({
        tagId: new Id(tagId),
        by: session.user.id,
        dto: { hexColor, name, description },
      });

      if (result.isErr()) {
        const error = result.unwrapErr();
        if (error instanceof TagNotFoundError) {
          return c.json({ error: "TAG_NOT_FOUND" as const }, 404);
        }

        if (error instanceof NotOwnerOfCollectionError) {
          return c.json({ error: "FORBIDDEN" as const }, 403);
        }

        if (error instanceof TagAlreadyExistsError) {
          return c.json({ error: "TAG_ALREADY_EXISTS" as const }, 409);
        }

        throw error;
      }

      const tag = result.unwrap();
      return c.json({ tag: makeTagDto(tag) }, 200);
    }
  );
