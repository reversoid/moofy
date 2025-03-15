import { CollectionTag } from "../entities/collection-tag";
import { Id } from "../utils";
import { IBaseRepository } from "./base.repository";

export abstract class ICollectionTagRepository extends IBaseRepository<CollectionTag> {
  abstract getTagsByCollectionId(collectionId: Id): Promise<CollectionTag[]>;
}
