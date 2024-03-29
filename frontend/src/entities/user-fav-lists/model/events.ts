import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { Id } from '@/shared/api/types/shared';
import { createEvent } from 'effector';

export const setFavorites = createEvent<FavoriteList[]>();
export const addToFavorites = createEvent<FavoriteList>();
export const removeFromFavorites = createEvent<{ listId: Id }>();
export const clearFavorites = createEvent<void>();
