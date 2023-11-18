import { z } from 'zod';

export const removeFromFavoritesCollectionResponse = z.object({
  id: z.number().int(),
});

export type RemoveFromFavoriteResponse = z.infer<
  typeof removeFromFavoritesCollectionResponse
>;
