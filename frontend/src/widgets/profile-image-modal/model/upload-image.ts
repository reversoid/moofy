// TODO move to actions
// TODO move api to actions

import { combine, createEffect, createEvent, createStore, sample } from "effector";
import { profileImageService } from "../api/profile-image.service";

export const uploadProfileImage = createEvent<{ file: File }>();
export const clearImageUploadState = createEvent();

export const uploadProfileImageFx = createEffect<{ file: File }, { link: string }>();
uploadProfileImageFx.use(({ file }) => profileImageService.uploadImage(file));

const $uploadImageSuccess = createStore<{ link: string } | null>(null);
$uploadImageSuccess.on(uploadProfileImageFx.doneData, (state, payload) => payload);
$uploadImageSuccess.on(clearImageUploadState, () => null);

export const $uploadImageListState = combine({
  success: $uploadImageSuccess,
  loading: uploadProfileImageFx.pending,
});

sample({
  clock: uploadProfileImage,
  target: uploadProfileImageFx,
});
