import { Collection } from './models/collection';

export type CreateCollectionProps = {
  name: string;
  description: string | null;
  imageUrl: string | null;
  isPrivate: boolean;
};

export type CreatePersonalCollectionProps = Pick<
  CreateCollectionProps,
  'name' | 'description' | 'imageUrl'
>;

export type UpdateCollectionProps = {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  id: Collection['id'];
  isPrivate?: boolean;
};

export type UpdatePersonalCollectionProps = Pick<
  UpdateCollectionProps,
  'description' | 'imageUrl' | 'name'
>;
