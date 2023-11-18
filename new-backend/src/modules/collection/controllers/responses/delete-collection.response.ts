import { z } from 'zod';
import { collectionSchema } from '../../models/collection';

export const deleteCollectionResponseSchema = z.object({
  id: collectionSchema.shape.id,
});

export type DeleteCollectionResponse = z.infer<
  typeof deleteCollectionResponseSchema
>;
