import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { profileImageService } from '../../api/profile-image.service';

export const uploadProfileImage = createEvent<{ file: File }>();

export const uploadProfileImageFx = createEffect<
  { file: File },
  { link: string }
>();
uploadProfileImageFx.use(({ file }) => profileImageService.uploadImage(file));

const $uploadProfileImageSuccess = createStore<{ link: string } | null>(null);
$uploadProfileImageSuccess.on(
  uploadProfileImageFx.doneData,
  (state, payload) => payload,
);

export const $uploadProfileImageState = combine({
  success: $uploadProfileImageSuccess,
  loading: uploadProfileImageFx.pending,
});

sample({
  clock: uploadProfileImage,
  target: uploadProfileImageFx,
});



