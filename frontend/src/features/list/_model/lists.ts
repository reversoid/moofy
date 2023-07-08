import { logoutFx } from '@/features/auth/model/logout';
import { List } from '@/shared/api/types/list.type';
import { createStore } from 'effector';

export const $lists = createStore<List[] | null>(null);

$lists.on(logoutFx.doneData, () => null);
