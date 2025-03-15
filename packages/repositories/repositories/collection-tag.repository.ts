import { ICollectionTagRepository } from "@repo/core/repositories";
import { CollectionTag } from "../../core/entities/collection-tag";
import { db } from "../db";
import { Id } from "@repo/core/utils";
import { CollectionTagSelects } from "./utils/selects";
import { makeCollectionTag } from "./utils/make-entity";

export class CollectionTagRepository extends ICollectionTagRepository {
  async getTagsByCollectionId(collectionId: Id): Promise<CollectionTag[]> {
    const tags = await db
      .selectFrom("collectionTags")
      .select(CollectionTagSelects.collectionTagSelects)
      .where("collectionId", "=", collectionId.value)
      .execute();

    return tags.map(makeCollectionTag);
  }

  async create(tag: CollectionTag): Promise<CollectionTag> {
    const newTag = await db
      .insertInto("collectionTags")
      .values({
        collectionId: tag.collectionId.value,
        name: tag.name,
        hslColor: tag.hslColor,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new CollectionTag({
      id: new Id(newTag.id),
      collectionId: new Id(newTag.collectionId),
      name: newTag.name,
      hslColor: newTag.hslColor,
      createdAt: newTag.createdAt,
    });
  }

  async get(id: Id): Promise<CollectionTag | null> {
    const tag = await db
      .selectFrom("collectionTags")
      .select(CollectionTagSelects.collectionTagSelects)
      .where("id", "=", id.value)
      .executeTakeFirst();

    if (!tag) {
      return null;
    }

    return makeCollectionTag(tag);
  }

  async update(id: Id, tag: Partial<CollectionTag>): Promise<CollectionTag> {
    const updatedTag = await db
      .updateTable("collectionTags")
      .set({
        name: tag.name,
        hslColor: tag.hslColor,
      })
      .where("id", "=", id.value)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new CollectionTag({
      id: new Id(updatedTag.id),
      collectionId: new Id(updatedTag.collectionId),
      name: updatedTag.name,
      hslColor: updatedTag.hslColor,
      createdAt: updatedTag.createdAt,
    });
  }

  async remove(id: Id): Promise<void> {
    await db.deleteFrom("collectionTags").where("id", "=", id.value).execute();
  }
}
