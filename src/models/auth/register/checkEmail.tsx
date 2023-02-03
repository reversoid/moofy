import { createEffect, createEvent, sample } from 'effector';
import { authService } from '@/features/auth/services/auth.service';

export interface CheckEmailDTO {
  email: string;
}

export const checkEmail = createEvent<CheckEmailDTO>();

export const checkEmailFx = createEffect<CheckEmailDTO, boolean>();
checkEmailFx.use(async ({ email }: CheckEmailDTO) => {
  return authService.checkEmailExistence(email);
});

sample({
  clock: checkEmail,
  target: checkEmailFx,
});
