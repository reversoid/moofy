import { createEvent, createStore } from 'effector';

export const $searchValue = createStore('');
export const setSearchValue = createEvent<{ newValue: string }>();

$searchValue.on(setSearchValue, (state, payload) => payload.newValue);
