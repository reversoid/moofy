import { combine, createEffect, createEvent, restore, sample } from 'effector';
import { Profile } from '@/shared/api/types/profile.type';
import { profileService } from '../api/profile.service';

export const editProfileDescription = createEvent<{ newValue: string }>();
export const clearState = createEvent<void>();

export const editProfileDescriptionFx = createEffect<
  { newValue: string },
  Omit<Profile, 'favLists' | 'allLists'>
>();

export const $editProfileResult = restore(editProfileDescriptionFx, null);
$editProfileResult.on(clearState, () => null);

export const $editProfileState = combine({
  loading: editProfileDescriptionFx.pending,
  result: $editProfileResult,
});

editProfileDescriptionFx.use(({ newValue }) =>
  profileService.editProfileDescription(newValue),
);

sample({
  clock: editProfileDescription,
  target: editProfileDescriptionFx,
});
