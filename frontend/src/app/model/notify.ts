import { createEvent, createStore } from 'effector';

export const notify = createEvent<string>();
export const clearAppNotify = createEvent();

export const $appNotifyStore = createStore<{ message: string | null }>({
  message: null,
});

$appNotifyStore.on(notify, (_, payload) => ({ message: payload }));
$appNotifyStore.on(clearAppNotify, () => ({ message: null }));
