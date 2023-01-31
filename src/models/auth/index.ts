import { createEffect, createEvent, forward } from 'effector';
import {
  LoginDTO,
  RegisterDTO,
  authService,
} from '@/features/auth/services/auth.service';

export const login = createEvent<LoginDTO>();
export const register = createEvent<RegisterDTO>();

export const loginFx = createEffect<LoginDTO, void>();
loginFx.use(async (data: LoginDTO) => {
  return authService.login(data);
});

export const registerFx = createEffect<RegisterDTO, void>();
registerFx.use(async (data: RegisterDTO) => {
  return authService.register(data);
});

forward({
  from: login,
  to: loginFx,
});

forward({
  from: register,
  to: registerFx,
});
