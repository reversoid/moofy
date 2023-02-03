import { createEffect, createEvent, createStore, sample } from 'effector';

export const setAppError = createEvent<string>();
export const clearAppError = createEvent();

const setErrorFx = createEffect<string, string>();
setErrorFx.use((errorCode) => errorCode);

export const $appErrorStore = createStore<string | null>(null);
$appErrorStore.on(setErrorFx.doneData, (_, payload) => payload);
$appErrorStore.on(clearAppError, () => null);

sample({
  clock: setAppError,
  target: setErrorFx,
});
