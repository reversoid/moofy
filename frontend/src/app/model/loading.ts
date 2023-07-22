import { createEvent, createStore } from 'effector';

export const setLoading = createEvent<boolean>();

export const $loading = createStore<boolean>(false);
$loading.on(setLoading, (state, payload) => payload);
