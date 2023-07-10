import { List } from '@/shared/api/types/list.type';
import { Profile } from '@/shared/api/types/profile.type';
import { createEvent, createStore } from 'effector';

export const $profileLists = createStore<List[] | null>(null);

export const setProfileLists = createEvent<List[]>();

$profileLists.on(setProfileLists, (state, newLists) => newLists);
