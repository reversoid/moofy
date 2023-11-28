import { ProfileEventDto } from 'src/modules/events/utils/profile-events/types';

export type RemoveProfileEventDto = Omit<ProfileEventDto, 'type'>;
