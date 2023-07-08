import { createEvent } from 'effector';
import { RemoveFromFavoritesDTO } from '../../_api/list.service';

export const removeFromFavorites = createEvent<RemoveFromFavoritesDTO>();
