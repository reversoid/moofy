import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../shared/types';

export const currentUserActions = createActionGroup({
  source: 'Current User',
  events: {
    set: props<{ user: User }>(),
    clear: emptyProps(),
  },
});
