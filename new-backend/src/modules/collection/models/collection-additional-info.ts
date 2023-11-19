import { z } from 'zod';

export const collectionAdditionalInfoSchema = z.object({
  isFavorite: z.boolean(),
  isLiked: z.boolean(),
});

export type CollectionAdditionalInfo = z.infer<
  typeof collectionAdditionalInfoSchema
>;
