import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Collection } from '../../shared/types';

export const featureKey = 'user-collections';

export interface State extends EntityState<Collection> {}

export const adapter: EntityAdapter<Collection> = createEntityAdapter<Collection>({
  selectId: (c) => c.id,
});
