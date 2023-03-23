import { profileService } from '@/features/get-profile/api/profile.service';
import { Profile } from '@/shared/api/types/profile.type';
import {
    combine,
  createEffect,
  createEvent,
  createStore,
  restore,
  sample,
} from 'effector';

export const getProfile = createEvent<number | undefined>();
export const clearState = createEvent<void>();

export const getProfileFx = createEffect<number | undefined, Profile>();
getProfileFx.use((id) => profileService.getProfile(id));

const $getProfileSuccess = restore(getProfileFx, null);
$getProfileSuccess.on(clearState, () => null);

const $getProfileError = createStore<string | null>(null);
$getProfileError.on(
  getProfileFx.failData,
  (state, payload) => (payload.cause as any)?.message ?? null,
);
$getProfileError.on(clearState, () => null);

export const $getProfileState = combine({
  isLoading: getProfileFx.pending,
  success: $getProfileSuccess,
  error: $getProfileError,
});

sample({
  clock: getProfile,
  target: getProfileFx,
});
