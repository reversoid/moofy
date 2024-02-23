import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Collection } from '../../shared/types';

export const userCollectionsActions = createActionGroup({
  source: 'User collections',
  events: {
    set: props<{ collections: Collection[] }>(),
    remove: props<{ collectionId: Collection['id'] }>(),
    add: props<{ collection: Collection }>(),
    update: props<{ collection: Collection }>(),
    clear: emptyProps(),
  },
});
