import { UserEvent } from 'src/modules/events/models/user-event';
import { AllowedProfileEvents, ProfileEvent } from '../models/profile-event';

const allowedProfileEvents: AllowedProfileEvents[] = [
  'COMMENT_CREATED',
  'COMMENT_LIKED',
  'LIST_LIKED',
  'SUBSCRIBED',
];

const allowedProfileEventsSet = new Set<UserEvent['type']>(
  allowedProfileEvents,
);

export const isAllowedProfileEvent = (
  event: UserEvent,
): event is ProfileEvent => allowedProfileEventsSet.has(event.type);
