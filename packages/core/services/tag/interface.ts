import { Result } from "resulto";
import { CollectionTag } from "../../entities/collection-tag";
import { ReviewTag } from "../../entities/review-tag";
import { Id } from "../../utils";
import {
  CollectionNotFoundError,
  NoAccessToPrivateCollectionError,
  NotOwnerOfCollectionError,
} from "../collection";
import { NotOwnerOfReviewError, ReviewNotFoundError } from "../review";
import { CollectionTagNotFoundError } from "./errors";
import { User } from "../../entities";

export type CreateCollectionTagDto = {
  name: string;
  hslColor: string;
};

export type EditCollectionTagDto = {
  name?: string;
  hslColor?: string;
};

export interface ITagService {
  getTagsByCollectionId(props: {
    collectionId: Id;
    by?: User["id"];
  }): Promise<
    Result<
      CollectionTag[],
      CollectionNotFoundError | NoAccessToPrivateCollectionError
    >
  >;

  createCollectionTag(props: {
    collectionId: Id;
    dto: CreateCollectionTagDto;
    by: User["id"];
  }): Promise<
    Result<CollectionTag, CollectionNotFoundError | NotOwnerOfCollectionError>
  >;

  linkTagToReview(props: {
    reviewId: Id;
    tagId: Id;
    by: User["id"];
  }): Promise<Result<ReviewTag, ReviewNotFoundError | NotOwnerOfReviewError>>;

  unlinkTagFromReview(props: {
    reviewId: Id;
    tagId: Id;
    by: User["id"];
  }): Promise<Result<null, ReviewNotFoundError | NotOwnerOfReviewError>>;

  deleteCollectionTag(props: {
    tagId: Id;
    by: User["id"];
  }): Promise<
    Result<null, CollectionTagNotFoundError | NotOwnerOfCollectionError>
  >;

  editCollectionTag(props: {
    tagId: Id;
    dto: EditCollectionTagDto;
    by: User["id"];
  }): Promise<
    Result<
      CollectionTag,
      CollectionTagNotFoundError | NotOwnerOfCollectionError
    >
  >;
}
