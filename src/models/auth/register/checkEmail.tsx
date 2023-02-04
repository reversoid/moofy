import { createEffect, createEvent, sample, createStore } from 'effector';
import { authService } from '@/features/auth/services/auth.service';

export interface CheckEmailDTO {
  email: string;
}

export const checkEmail = createEvent<CheckEmailDTO>();

export const checkEmailFx = createEffect<CheckEmailDTO, boolean>();
checkEmailFx.use(async ({ email }: CheckEmailDTO) => {
  return authService.checkEmailExistence(email);
});

export const $checkEmailResult = createStore<boolean | null>(null).on(
  checkEmailFx.doneData,
  (state, payload) => payload,
);

sample({
  clock: checkEmail,
  target: checkEmailFx,
});
