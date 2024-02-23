import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { CollectionWithInfo } from '../../shared/types';

export const featureKey = 'user-collections';

export interface State extends EntityState<CollectionWithInfo> {}

export const adapter: EntityAdapter<CollectionWithInfo> = createEntityAdapter<CollectionWithInfo>({
  selectId: (c) => c.collection.id,
});
