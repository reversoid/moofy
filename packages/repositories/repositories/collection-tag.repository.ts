import { ICollectionTagRepository } from "@repo/core/repositories";
import { db } from "../db";
import { Id } from "@repo/core/utils";
import { CollectionTagSelects } from "./utils/selects";
import { makeTag } from "./utils/make-entity";
import { Tag } from "@repo/core/entities";

export class CollectionTagRepository extends ICollectionTagRepository {
  async getTagsByCollectionId(collectionId: Id): Promise<Tag[]> {
    const tags = await db
      .selectFrom("collectionTags")
      .select(CollectionTagSelects.collectionTagSelects)
      .where("collectionId", "=", collectionId.value)
      .orderBy("collectionTags.id asc")
      .execute();

    return tags.map(makeTag);
  }

  async create(tag: Tag): Promise<Tag> {
    const newTag = await db
      .insertInto("collectionTags")
      .values({
        collectionId: tag.collectionId.value,
        name: tag.name,
        hexColor: tag.hexColor,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Tag({
      id: new Id(newTag.id),
      collectionId: new Id(newTag.collectionId),
      name: newTag.name,
      hexColor: newTag.hexColor,
      createdAt: newTag.createdAt,
    });
  }

  async get(id: Id): Promise<Tag | null> {
    const tag = await db
      .selectFrom("collectionTags")
      .select(CollectionTagSelects.collectionTagSelects)
      .where("id", "=", id.value)
      .executeTakeFirst();

    if (!tag) {
      return null;
    }

    return makeTag(tag);
  }

  async update(id: Id, tag: Partial<Tag>): Promise<Tag> {
    const updatedTag = await db
      .updateTable("collectionTags")
      .set({
        name: tag.name,
        hexColor: tag.hexColor,
      })
      .where("id", "=", id.value)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Tag({
      id: new Id(updatedTag.id),
      collectionId: new Id(updatedTag.collectionId),
      name: updatedTag.name,
      hexColor: updatedTag.hexColor,
      createdAt: updatedTag.createdAt,
    });
  }

  async remove(id: Id): Promise<void> {
    await db.deleteFrom("collectionTags").where("id", "=", id.value).execute();
  }
}
