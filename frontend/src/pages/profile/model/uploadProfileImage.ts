import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { profileService } from '../api/profile.service';

export const uploadImage = createEvent<{ file: File }>();
export const clearImageUploadState = createEvent();

export const uploadImageFx = createEffect<{ file: File }, { link: string }>();
uploadImageFx.use(({ file }) => profileService.uploadImage(file));

const $uploadImageSuccess = createStore<{ link: string } | null>(null);
$uploadImageSuccess.on(uploadImageFx.doneData, (state, payload) => payload);
$uploadImageSuccess.on(clearImageUploadState, () => null);

export const $uploadImageProfileState = combine({
  success: $uploadImageSuccess,
  loading: uploadImageFx.pending,
});

sample({
  clock: uploadImage,
  target: uploadImageFx,
});
