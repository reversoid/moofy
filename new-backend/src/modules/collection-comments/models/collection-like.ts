import { collectionSchema } from 'src/modules/collection/models/collection';
import { userSchema } from 'src/modules/user/models/user';
import { z } from 'zod';

export const collectionLikeSchema = z.object({
  id: z.number().int(),
  collection: collectionSchema,
  user: userSchema,
});

export type CollectionLike = z.infer<typeof collectionLikeSchema>;
