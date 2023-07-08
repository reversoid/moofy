import { createEvent } from 'effector';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';

export const addToFavorites = createEvent<{ favList: FavoriteList }>();
