import { Collection } from '../../../shared/types';

export type CreateCollectionProps = Pick<
  Collection,
  'name' | 'description' | 'imageUrl' | 'isPublic'
>;

export type UpdateCollectionProps = Pick<
  Collection,
  'name' | 'description' | 'imageUrl' | 'isPublic' | 'id'
>;

export interface CreatePersonalCollectionProps {
  collectionData: Pick<Collection, 'name' | 'description' | 'imageUrl'>;
  mergeOptions?: {
    collectionIds: number[];
    reviews: {
      withScore: boolean;
      strategy: 'copy' | 'move';
    };
    actionAfterMerging: 'saveAll' | 'removeAll' | 'removeEmpty';
  };
}
