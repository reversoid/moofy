import { createEffect, createEvent, createStore, sample } from 'effector';

const errorsTranlations = {
  NETWORK_ERROR: 'Ошибка соединения',
  EMAIL_ALREADY_TAKEN: 'Данный Email уже зарегистрирован',
  USERNAME_ALREADY_TAKEN: 'Имя пользователя уже занято',
  REVIEW_FOR_FILM_ALREADY_EXISTS: 'Обзор на фильм уже существует',
};

export const setAppError = createEvent<string>();
export const clearAppError = createEvent();

const setErrorFx = createEffect<string, string | null>();
setErrorFx.use(
  (errorCode) =>
    errorsTranlations[errorCode as keyof typeof errorsTranlations] ?? null,
);

export const $appErrorStore = createStore<string | null>(null);
$appErrorStore.on(setErrorFx.doneData, (_, payload) => payload);
$appErrorStore.on(clearAppError, () => null);

sample({
  clock: setAppError,
  target: setErrorFx,
});
