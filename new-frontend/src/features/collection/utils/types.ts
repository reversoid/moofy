import { Collection, Comment } from '../../../shared/types';

export type CreateCollectionProps = Pick<
  Collection,
  'name' | 'description' | 'imageUrl' | 'isPublic'
>;

export type UpdateCollectionProps = Pick<
  Collection,
  'name' | 'description' | 'imageUrl' | 'isPublic' | 'id'
>;

export interface SendCommentDto {
  text: string;
  replyTo?: Comment['id'];
}
