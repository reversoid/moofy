import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { profileImageService } from '../../api/profile-image.service';
import { Profile } from '@/shared/api/types/profile.type';

export const saveProfileImage = createEvent<{ link: string }>();
export const clearState = createEvent();

export const saveProfileImageFx = createEffect<{ link: string }, Profile>();
saveProfileImageFx.use(({ link }) => profileImageService.saveImage(link));

const $saveImageSuccess = createStore<Profile | null>(null);
$saveImageSuccess.on(saveProfileImageFx.doneData, (state, payload) => payload);
$saveImageSuccess.on(clearState, () => null);

export const $profileImageSaveState = combine({
  success: $saveImageSuccess,
});

sample({
  clock: saveProfileImage,
  target: saveProfileImageFx,
});
