import { Tag } from "../entities";
import { Id } from "../utils";
import { IBaseRepository } from "./base.repository";

export abstract class ICollectionTagRepository extends IBaseRepository<Tag> {
  abstract getTagsByCollectionId(collectionId: Id): Promise<Tag[]>;
}
