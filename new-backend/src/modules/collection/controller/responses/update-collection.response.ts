import { z } from 'zod';
import { collectionWithInfoSchema } from '../../models/collection-with-info';

export const updateCollectionResponseSchema = collectionWithInfoSchema;

export type UpdateCollectionResponse = z.infer<
  typeof updateCollectionResponseSchema
>;
