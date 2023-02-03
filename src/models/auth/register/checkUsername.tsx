import { createEffect, createEvent, sample } from 'effector';
import { authService } from '@/features/auth/services/auth.service';

export interface CheckUsernameDTO {
  username: string;
}

export const checkUsername = createEvent<CheckUsernameDTO>();

export const checkUsernameFx = createEffect<CheckUsernameDTO, boolean>();
checkUsernameFx.use(async ({ username }: CheckUsernameDTO) => {
  return authService.checkUsernameExistence(username);
});

sample({
  clock: checkUsername,
  target: checkUsernameFx,
});
