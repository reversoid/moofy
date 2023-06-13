import { combine, createEvent, createStore, sample } from 'effector';
import { uploadProfileImage, uploadProfileImageFx } from './upload-image';
import { saveProfileImage, saveProfileImageFx } from './save-image';
import { Profile } from '@/shared/api/types/profile.type';

export * from './save-image';
export * from './upload-image';

export const uploadAndSaveProfileImage = createEvent<{ file: File }>();
export const clearUploadAndSaveProfileImageState = createEvent<void>();

const $uploadAndSaveSuccess = createStore<Profile | null>(null);
$uploadAndSaveSuccess.on(
  saveProfileImageFx.doneData,
  (state, payload) => payload,
);
$uploadAndSaveSuccess.on(clearUploadAndSaveProfileImageState, (state) => null);

export const $uploadAndSaveState = combine({
  loading: combine(
    saveProfileImageFx.pending,
    uploadProfileImageFx.pending,
    (saving, uploading) => saving || uploading,
  ),
  success: $uploadAndSaveSuccess,
});

// Clear previous state
sample({
  clock: uploadAndSaveProfileImage,
  target: clearUploadAndSaveProfileImageState,
});

// Upload image to cloud
sample({
  clock: uploadAndSaveProfileImage,
  target: uploadProfileImage,
});

// Then save profile image
sample({
  clock: uploadProfileImageFx.doneData,
  target: saveProfileImage,
});
