import { Result } from "resulto";
import { Id } from "../../utils";
import {
  CollectionNotFoundError,
  NoAccessToPrivateCollectionError,
  NotOwnerOfCollectionError,
} from "../collection";
import { ReviewNotFoundError } from "../review";
import {
  TagAlreadyExistsError,
  TagAlreadyLinkedToReviewError,
  TagNotFoundError,
  TagNotLinkedToReviewError,
} from "./errors";
import { Tag, User } from "../../entities";

export type CreateCollectionTagDto = {
  name: string;
  hexColor: string;
};

export type EditCollectionTagDto = {
  name?: string;
  hexColor?: string;
};

export interface ITagService {
  getTagsByCollectionId(props: {
    collectionId: Id;
    by?: User["id"];
  }): Promise<
    Result<Tag[], CollectionNotFoundError | NoAccessToPrivateCollectionError>
  >;

  createCollectionTag(props: {
    collectionId: Id;
    dto: CreateCollectionTagDto;
    by: User["id"];
  }): Promise<
    Result<
      Tag,
      | CollectionNotFoundError
      | NotOwnerOfCollectionError
      | TagAlreadyExistsError
    >
  >;

  linkTagToReview(props: {
    reviewId: Id;
    tagId: Id;
    by: User["id"];
  }): Promise<
    Result<
      null,
      | TagNotFoundError
      | NotOwnerOfCollectionError
      | ReviewNotFoundError
      | TagAlreadyLinkedToReviewError
    >
  >;

  unlinkTagFromReview(props: {
    reviewId: Id;
    tagId: Id;
    by: User["id"];
  }): Promise<
    Result<
      null,
      | TagNotFoundError
      | NotOwnerOfCollectionError
      | ReviewNotFoundError
      | TagNotLinkedToReviewError
    >
  >;

  deleteTag(props: {
    tagId: Id;
    by: User["id"];
  }): Promise<Result<null, TagNotFoundError | NotOwnerOfCollectionError>>;

  editTag(props: {
    tagId: Id;
    dto: EditCollectionTagDto;
    by: User["id"];
  }): Promise<
    Result<
      Tag,
      TagNotFoundError | NotOwnerOfCollectionError | TagAlreadyExistsError
    >
  >;
}
