import { ProfileEventDto } from 'src/modules/events/utils/profile-events/types';

export type CreateProfileEventDto = Omit<ProfileEventDto, 'type'>;
