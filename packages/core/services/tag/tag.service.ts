import { err, ok, Result } from "resulto";
import { ICollectionTagRepository } from "../../repositories/collection-tag.repository";
import { IReviewTagRepository } from "../../repositories/review-tag.repository";
import {
  CreateCollectionTagDto,
  EditCollectionTagDto,
  ITagService,
} from "./interface";
import {
  ICollectionService,
  NoAccessToPrivateCollectionError,
  NotOwnerOfCollectionError,
} from "../collection";
import { CollectionNotFoundError } from "../collection";
import { Id } from "../../utils";
import { Tag, User } from "../../entities";
import {
  TagAlreadyExistsError,
  TagAlreadyLinkedToReviewError,
  TagNotFoundError,
  TagNotLinkedToReviewError,
} from "./errors";
import { IReviewService, ReviewNotFoundError } from "../review";

export class TagService implements ITagService {
  constructor(
    private readonly collectionTagRepository: ICollectionTagRepository,
    private readonly reviewTagRepository: IReviewTagRepository,
    private readonly collectionService: ICollectionService,
    private readonly reviewService: IReviewService
  ) {}

  async getTagsByCollectionId(props: {
    collectionId: Id;
    by?: User["id"];
  }): Promise<
    Result<Tag[], CollectionNotFoundError | NoAccessToPrivateCollectionError>
  > {
    const collectionResult = await this.collectionService.getCollection({
      id: props.collectionId,
      by: props.by,
    });

    if (collectionResult.isErr()) {
      return err(new NotOwnerOfCollectionError());
    }

    const collection = collectionResult.value;

    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    const tags = await this.collectionTagRepository.getTagsByCollectionId(
      props.collectionId
    );

    return ok(tags);
  }

  async createCollectionTag(props: {
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
  > {
    const collectionResult = await this.collectionService.getCollection({
      id: props.collectionId,
      by: props.by,
    });

    if (collectionResult.isErr()) {
      return err(new NotOwnerOfCollectionError());
    }

    const collection = collectionResult.value;

    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    if (collection.creator.id.value !== props.by.value) {
      return err(new NotOwnerOfCollectionError());
    }

    try {
      const newTag = await this.collectionTagRepository.create(
        Tag.create({
          collectionId: props.collectionId,
          hexColor: props.dto.hexColor,
          name: props.dto.name,
          description: props.dto.description,
        })
      );

      return ok(newTag);
    } catch (error) {
      // TODO can we make it better?
      if (error instanceof Error && "code" in error && error.code === "23505") {
        return err(new TagAlreadyExistsError());
      }

      throw error;
    }
  }

  async deleteTag(props: {
    tagId: Id;
    by: User["id"];
  }): Promise<Result<null, TagNotFoundError | NotOwnerOfCollectionError>> {
    const tag = await this.collectionTagRepository.get(props.tagId);

    if (!tag) {
      return err(new TagNotFoundError());
    }

    const collectionResult = await this.collectionService.getCollection({
      id: tag.collectionId,
      by: props.by,
    });

    if (collectionResult.isErr()) {
      return err(new NotOwnerOfCollectionError());
    }

    if (!collectionResult.value) {
      throw new Error(
        "Collection not found, however tag was found, it is weird."
      );
    }

    const collection = collectionResult.value;

    if (collection.creator.id.value !== props.by.value) {
      return err(new NotOwnerOfCollectionError());
    }

    await this.collectionTagRepository.remove(props.tagId);

    return ok(null);
  }

  async linkTagToReview(props: {
    tagId: Id;
    reviewId: Id;
    by: User["id"];
  }): Promise<Result<null, TagNotFoundError | NotOwnerOfCollectionError>> {
    const reviewResult = await this.reviewService.getReview({
      id: props.reviewId,
      by: props.by,
    });

    if (reviewResult.isErr()) {
      return err(new NotOwnerOfCollectionError());
    }

    const review = reviewResult.value;

    if (!review) {
      return err(new ReviewNotFoundError());
    }

    const collectionResult = await this.collectionService.getCollection({
      id: review.collectionId,
      by: props.by,
    });

    if (collectionResult.isErr()) {
      const error = collectionResult.error;
      if (error instanceof NoAccessToPrivateCollectionError) {
        return err(new NotOwnerOfCollectionError());
      }

      throw error;
    }

    const collection = collectionResult.value;

    if (collection?.creator.id.value !== props.by.value) {
      return err(new NotOwnerOfCollectionError());
    }

    if (review.tags.find((tag) => tag.id.value === props.tagId.value)) {
      return err(new TagAlreadyLinkedToReviewError());
    }

    const tag = await this.collectionTagRepository.get(props.tagId);

    if (!tag) {
      return err(new TagNotFoundError());
    }

    if (tag.collectionId.value !== review.collectionId.value) {
      return err(new TagNotFoundError());
    }

    await this.reviewTagRepository.linkTagToReview(props.tagId, props.reviewId);

    return ok(null);
  }

  async unlinkTagFromReview(props: {
    tagId: Id;
    reviewId: Id;
    by: User["id"];
  }): Promise<Result<null, TagNotFoundError | NotOwnerOfCollectionError>> {
    const reviewResult = await this.reviewService.getReview({
      id: props.reviewId,
      by: props.by,
    });

    if (reviewResult.isErr()) {
      return err(new NotOwnerOfCollectionError());
    }

    const review = reviewResult.value;

    if (!review) {
      return err(new ReviewNotFoundError());
    }

    const collectionResult = await this.collectionService.getCollection({
      id: review.collectionId,
      by: props.by,
    });

    if (collectionResult.isErr()) {
      const error = collectionResult.error;
      if (error instanceof NoAccessToPrivateCollectionError) {
        return err(new NotOwnerOfCollectionError());
      }

      throw error;
    }

    const collection = collectionResult.value;

    if (collection?.creator.id.value !== props.by.value) {
      return err(new NotOwnerOfCollectionError());
    }

    if (!review.tags.find((tag) => tag.id.value === props.tagId.value)) {
      return err(new TagNotLinkedToReviewError());
    }

    const tag = await this.collectionTagRepository.get(props.tagId);

    if (!tag) {
      return err(new TagNotFoundError());
    }

    if (tag.collectionId.value !== review.collectionId.value) {
      return err(new TagNotFoundError());
    }

    await this.reviewTagRepository.unlinkTagFromReview(
      props.tagId,
      props.reviewId
    );

    return ok(null);
  }

  async editTag(props: {
    tagId: Id;
    dto: EditCollectionTagDto;
    by: User["id"];
  }): Promise<Result<Tag, TagNotFoundError | NotOwnerOfCollectionError>> {
    const tag = await this.collectionTagRepository.get(props.tagId);

    if (!tag) {
      return err(new TagNotFoundError());
    }

    const collectionResult = await this.collectionService.getCollection({
      id: tag.collectionId,
      by: props.by,
    });

    if (collectionResult.isErr()) {
      return err(new NotOwnerOfCollectionError());
    }

    const collection = collectionResult.value;

    if (!collection) {
      throw new Error(
        "Collection not found, however tag was found, it is weird."
      );
    }

    if (collection.creator.id.value !== props.by.value) {
      return err(new NotOwnerOfCollectionError());
    }

    if (props.dto.name) {
      tag.name = props.dto.name;
    }

    if (props.dto.hexColor) {
      tag.hexColor = props.dto.hexColor;
    }

    if (props.dto.description !== undefined) {
      tag.description = props.dto.description;
    }

    try {
      await this.collectionTagRepository.update(tag.id, tag);
    } catch (error) {
      // TODO can we make it better?
      if (error instanceof Error && "code" in error && error.code === "23505") {
        return err(new TagAlreadyExistsError());
      }

      throw error;
    }

    return ok(tag);
  }
}
