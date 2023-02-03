import {
  createEffect,
  createEvent,
  createStore,
  restore,
  sample,
} from 'effector';
import {
  RegisterDTO,
  authService,
} from '@/features/auth/services/auth.service';

export const register = createEvent<RegisterDTO>();

export const registerFx = createEffect<RegisterDTO, void>();
registerFx.use(async (data: RegisterDTO) => {
  return authService.register(data);
});

export const $registerError = restore<Error>(registerFx.failData, null);

export const $registerSuccess = createStore<boolean>(false);
$registerSuccess.on(registerFx.doneData, () => true);

sample({
  clock: register,
  target: registerFx,
});
