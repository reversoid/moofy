import { UserEvent } from 'src/modules/events/models/user-event';

export type AllowedProfileEvents = Extract<
  UserEvent['type'],
  'SUBSCRIBED' | 'COMMENT_LIKED' | 'COMMENT_CREATED' | 'LIST_LIKED'
>;

/** User event with narrowed "type" */
export interface ProfileEvent extends UserEvent {
  type: AllowedProfileEvents;
}
