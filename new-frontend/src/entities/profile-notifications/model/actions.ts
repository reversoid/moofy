import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const profileNotificationsActions = createActionGroup({
  source: 'Profile notifications',
  events: {
    setUnseenAmount: props<{ amount: number }>(),
    incrementUnseenAmount: emptyProps(),
    decrementUnseenAmount: emptyProps(),
  },
});
