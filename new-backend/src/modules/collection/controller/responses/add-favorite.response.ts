import { z } from 'zod';

export const addToFavoriteCollectionResponse = z.object({
  id: z.number().int(),
});

export type AddToFavoriteResponse = z.infer<
  typeof addToFavoriteCollectionResponse
>;
