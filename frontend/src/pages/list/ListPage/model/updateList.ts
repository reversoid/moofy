import { List } from '@/shared/api/types/list.type';
import { createEvent } from 'effector';

export const updateList = createEvent<{ list: List }>();
