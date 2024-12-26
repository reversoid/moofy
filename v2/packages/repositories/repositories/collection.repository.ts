import { Collection, User } from "@repo/core/entities";
import { ICollectionRepository } from "@repo/core/repositories";
import {
  PaginatedData,
  CreatableEntity,
  Id,
  decodeCursor,
} from "@repo/core/utils";
import { CollectionsTable, db, UsersTable } from "../db";
import { Selectable } from "kysely";
import { makeUser } from "./user.repository";

export const makeCollection = (
  collectionData: Selectable<CollectionsTable>,
  userData: Selectable<UsersTable>
): Collection => {
  return new Collection({
    id: new Id(collectionData.id),
    name: collectionData.name,
    description: collectionData.description,
    creator: makeUser(userData),
    isPublic: collectionData.isPublic,
    imageUrl: collectionData.imageUrl,
    createdAt: collectionData.createdAt,
    updatedAt: collectionData.updatedAt,
  });
};

export class CollectionRepository implements ICollectionRepository {
  searchCollections(search: string): Promise<Collection> {
    throw new Error("Method not implemented.");
  }

  async getUserCollections(
    userId: User["id"],
    limit: number,
    cursor?: string
  ): Promise<PaginatedData<Collection>> {
    const decodedCursor = cursor ? decodeCursor(cursor) : null;

    let query = db
      .selectFrom("collections")
      .where("userId", "=", userId.value)
      .limit(limit);

    if (decodedCursor) {
      query = query.where(
        "collections.updatedAt",
        ">=",
        new Date(decodedCursor)
      );
    }

    const data = await query.execute();
  }

  create(item: Collection | CreatableEntity<Collection>): Promise<Collection> {
    throw new Error("Method not implemented.");
  }

  get(id: Id): Promise<Collection | null> {
    throw new Error("Method not implemented.");
  }

  update(id: Id, value: Partial<Collection>): Promise<Collection> {
    throw new Error("Method not implemented.");
  }

  async remove(id: Id): Promise<void> {
    await db.deleteFrom("collections").where("id", "=", id.value).execute();
  }
}
