import { Collection } from '../../../shared/types';

export type CreateCollectionProps = Pick<
  Collection,
  'name' | 'description' | 'imageUrl' | 'isPublic'
>;

export type UpdateCollectionProps = Pick<
  Collection,
  'name' | 'description' | 'imageUrl' | 'isPublic' | 'id'
>;
