import { createEffect, createEvent, createStore, sample } from 'effector';

const errorsTranlations = new Map<string, string>([
  ['NETWORK_ERROR', 'Ошибка соединения'],
  ['EMAIL_ALREADY_TAKEN', 'Данный Email уже зарегистрирован'],
  ['USERNAME_ALREADY_TAKEN', 'Имя пользователя уже занято'],
]);

export const setAppError = createEvent<string>();
export const clearAppError = createEvent();

const setErrorFx = createEffect<string, string | null>();
setErrorFx.use((errorCode) => errorsTranlations.get(errorCode) ?? null); // TODO use Map to get and translate errors

export const $appErrorStore = createStore<string | null>(null);
$appErrorStore.on(setErrorFx.doneData, (_, payload) => payload);
$appErrorStore.on(clearAppError, () => null);

sample({
  clock: setAppError,
  target: setErrorFx,
});
