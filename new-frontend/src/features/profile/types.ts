import { Collection } from '../../shared/types';

export type EditProfileDto = {
  username?: string;
  description?: string | null;
  imageUrl?: string | null;
};

export type CreatePersonalCollectionProps = {
  name: string;
  description: string | null;
  imageUrl: string | null;
  mergeOptions: {
    collectionsIds: Array<Collection['id']>;
    reviews: {
      withScore: boolean;
      strategy: 'move' | 'copy';
    };
    actionAfterMergingCollections: 'saveAll' | 'removeAll' | 'removeEmpty';
  };
};
