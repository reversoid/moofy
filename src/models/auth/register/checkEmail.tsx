import { createEffect, createEvent, sample } from 'effector';
import { authService } from '@/features/auth/services/auth.service';
import { debouncePromise } from '@/shared/functions/debouncePromise';

export interface CheckEmailDTO {
  email: string;
}

export const checkEmail = createEvent<CheckEmailDTO>();

const checkEmailDebounced = debouncePromise(
  authService.checkEmailExistence,
  1000,
);

export const checkEmailFx = createEffect<CheckEmailDTO, boolean>();
checkEmailFx.use(async ({ email }: CheckEmailDTO) => {
  return checkEmailDebounced(email);
});

sample({
  clock: checkEmail,
  target: checkEmailFx,
});
