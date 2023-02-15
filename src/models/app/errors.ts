import { createEffect, createEvent, createStore, sample } from 'effector';

const errorsTranlations = {
  NETWORK_ERROR: 'Ошибка соединения',
  EMAIL_ALREADY_TAKEN: 'Данный Email уже зарегистрирован',
  USERNAME_ALREADY_TAKEN: 'Имя пользователя уже занято',
  REVIEW_FOR_FILM_ALREADY_EXISTS: 'Обзор на фильм уже существует',
  'Internal server error': 'Ошибка сервера',
};

export const setAppError = createEvent<string>();
export const clearAppError = createEvent();

const setErrorFx = createEffect<string, { error: string | null }>();
setErrorFx.use((errorCode) => ({
  error: errorsTranlations[errorCode as keyof typeof errorsTranlations] ?? null,
}));

export const $appErrorStore = createStore<{ error: string | null }>({
  error: null,
});
$appErrorStore.on(setErrorFx.doneData, (_, payload) => payload);
$appErrorStore.on(clearAppError, () => ({ error: null }));

sample({
  clock: setAppError,
  target: setErrorFx,
});
