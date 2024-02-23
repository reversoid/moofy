import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { CollectionWithInfo } from '../../shared/types';

export const featureKey = 'user-collections';

export interface State extends EntityState<CollectionWithInfo> {}

export const adapter: EntityAdapter<CollectionWithInfo> = createEntityAdapter<CollectionWithInfo>({
  selectId: (c) => c.collection.id,
  sortComparer(c1, c2) {
    return (
      new Date(c2.collection.updatedAt).getTime() - new Date(c1.collection.updatedAt).getTime()
    );
  },
});
