import { Collection, Comment } from '../../../shared/types';

export type CreateCollectionProps = Pick<
  Collection,
  'name' | 'description' | 'imageUrl' | 'isPublic'
>;

export type UpdateCollectionProps = Pick<
  Collection,
  'name' | 'description' | 'imageUrl' | 'isPublic' | 'id'
>;

export interface CreatePersonalCollectionProps {
  name: Collection['name'];
  description: Collection['description'];
  imageUrl: Collection['imageUrl'];

  mergeOptions?: {
    collectionIds: number[];
    reviews: {
      withScore?: boolean;
      strategy: 'copy' | 'move';
    };
    actionAfterMergingCollections: 'saveAll' | 'removeAll' | 'removeEmpty';
  };
}

export interface SendCommentDto {
  text: string;
  replyTo?: Comment['id'];
}
