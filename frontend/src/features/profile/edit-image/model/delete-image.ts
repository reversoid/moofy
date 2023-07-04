import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { profileImageService } from '../api/profile-image.service';
import { Profile } from '@/shared/api/types/profile.type';

export const deleteProfileImage = createEvent<void>();
export const clearDeleteProfileImageState = createEvent();

export const deleteProfileImageFx = createEffect<void, Profile>();
deleteProfileImageFx.use(() => profileImageService.deleteImage());

const $deleteImageSuccess = createStore<boolean | null>(null);
$deleteImageSuccess.on(deleteProfileImageFx.doneData, (state, payload) => true);
$deleteImageSuccess.on(clearDeleteProfileImageState, () => null);

export const $profileImageDeleteState = combine({
  success: $deleteImageSuccess,
  loading: deleteProfileImageFx.pending,
});

sample({
  clock: deleteProfileImage,
  target: deleteProfileImageFx,
});