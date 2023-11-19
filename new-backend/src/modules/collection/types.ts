import { User } from '../user/models/user';
import { Collection } from './models/collection';

export type CreateCollectionProps = {
  name: string;
  description: string | null;
  imageUrl: string | null;
  userId: User['id'];
};

export type UpdateCollectionProps = {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  id: Collection['id'];
};
