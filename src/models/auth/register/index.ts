import { combine, createEffect, createEvent, createStore, restore, sample } from 'effector';
import {
  RegisterDTO,
  authService,
} from '@/features/auth/services/auth.service';

export const register = createEvent<RegisterDTO>();

export const registerFx = createEffect<RegisterDTO, void>();
registerFx.use(async (data: RegisterDTO) => {
  return authService.register(data);
});

const $registerError = restore<Error>(registerFx.failData, null);

export const $registerStatus = combine({
  loading: registerFx.pending,
  error: $registerError,
});

sample({
  clock: register,
  target: registerFx,
});
