import {
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  restore,
} from 'effector';
import {
  LoginDTO,
  RegisterDTO,
  authService,
} from '@/features/auth/services/auth.service';

export const login = createEvent<LoginDTO>();
export const register = createEvent<RegisterDTO>();
export const clearLoginError = createEvent<void>();

export const loginFx = createEffect<LoginDTO, void>();
loginFx.use(async (data: LoginDTO) => {
  return authService.login(data);
});

export const registerFx = createEffect<RegisterDTO, void>();
registerFx.use(async (data: RegisterDTO) => {
  return authService.register(data);
});

export const $loginError = restore<Error>(loginFx.failData, null);
$loginError.on(clearLoginError, () => null);

export const $registerError = restore<Error>(registerFx.failData, null);

export const $loginSuccess = createStore<boolean>(false);
$loginSuccess.on(loginFx.doneData, () => true);

export const $registerSuccess = createStore<boolean>(false);
$registerSuccess.on(registerFx.doneData, () => true);

export const $loginStatus = combine({
  loading: loginFx.pending,
  success: $loginSuccess,
  error: $loginError,
});

forward({
  from: login,
  to: loginFx,
});

forward({
  from: register,
  to: registerFx,
});
