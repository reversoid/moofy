import { List } from '@/shared/api/types/list.type';
import { Id } from '@/shared/api/types/shared';
import { createEvent } from 'effector';

export const addList = createEvent<List>();
export const updateList = createEvent<List>();
export const removeList = createEvent<{ id: Id }>();
export const clearUserLists = createEvent<void>();
