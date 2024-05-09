import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CollectionWithInfo } from '../../shared/types';

export const userCollectionsActions = createActionGroup({
  source: 'User collections',
  events: {
    set: props<{ collections: CollectionWithInfo[] }>(),
    append: props<{ collections: CollectionWithInfo[] }>(),
    remove: props<{ collectionId: CollectionWithInfo['collection']['id'] }>(),
    add: props<{ collection: CollectionWithInfo }>(),
    update: props<{ collection: CollectionWithInfo }>(),
    clear: emptyProps(),
  },
});
