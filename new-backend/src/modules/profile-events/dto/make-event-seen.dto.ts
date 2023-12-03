import { ProfileSeenEventDto } from 'src/modules/events/utils/profile-events/types';

export type MakeEventSeenDto = Omit<ProfileSeenEventDto, 'toUserId'>;
