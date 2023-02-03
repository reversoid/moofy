import {
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  restore,
  sample,
} from 'effector';
import { LoginDTO, authService } from '@/features/auth/services/auth.service';

export const login = createEvent<LoginDTO>();
export const clearLoginError = createEvent<void>();

export const loginFx = createEffect<LoginDTO, void>();
loginFx.use(async (data: LoginDTO) => {
  return authService.login(data);
});

export const $loginError = restore<Error>(loginFx.failData, null);
$loginError.on(clearLoginError, () => null);

export const $loginSuccess = createStore<boolean>(false);
$loginSuccess.on(loginFx.doneData, () => true);

export const $loginStatus = combine({
  loading: loginFx.pending,
  success: $loginSuccess,
  error: $loginError,
});

sample({
  clock: login,
  target: loginFx,
});
