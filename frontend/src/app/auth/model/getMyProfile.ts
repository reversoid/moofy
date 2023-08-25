import { profileService } from '@/pages/profile/api/profile.service';
import { Profile } from '@/shared/api/types/profile.type';
import { createEffect } from 'effector';

export const getMyProfileFx = createEffect<{ id: number }, Profile>();

getMyProfileFx.use(({ id }) => profileService.getProfile(id));
