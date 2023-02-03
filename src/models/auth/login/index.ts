import {
  combine,
  createEffect,
  createEvent,
  restore,
  sample,
} from 'effector';
import { LoginDTO, authService } from '@/features/auth/services/auth.service';

export const login = createEvent<LoginDTO>();

export const loginFx = createEffect<LoginDTO, void>();
loginFx.use(async (data: LoginDTO) => {
  return authService.login(data);
});

const $loginError = restore<Error>(loginFx.failData, null);

export const $loginStatus = combine({
  loading: loginFx.pending,
  error: $loginError,
});

sample({
  clock: login,
  target: loginFx,
});
