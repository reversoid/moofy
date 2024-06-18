import { Collection } from '../../shared/types';

export interface CreatePersonalCollectionProps {
  name: Collection['name'];
  description: Collection['description'];
  imageUrl: Collection['imageUrl'];

  mergeOptions?: {
    collectionsIds: number[];
    reviews: {
      withScore: true | undefined;
      strategy: 'copy' | 'move';
    };
    actionAfterMergingCollections: 'saveAll' | 'removeAll' | 'removeEmpty';
  };
}
