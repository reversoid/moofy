import { authService } from '@/features/auth/services/auth.service';
import { createEffect, createEvent, createStore, sample } from 'effector';

export const logout = createEvent();
export const logoutFx = createEffect<void, void>();
logoutFx.use(() => authService.logout())

sample({
  clock: logout,
  target: logoutFx,
});
