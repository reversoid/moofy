import { createEvent, createStore } from 'effector';

export const notify = createEvent<{ message: string }>();
export const clearAppNotify = createEvent();

export const $appNotifyStore = createStore<{ message: string | null }>({
  message: null,
});

$appNotifyStore.on(notify, (_, payload) => payload);
$appNotifyStore.on(clearAppNotify, () => ({ message: null }));
