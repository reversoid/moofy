import { z } from 'zod';
import { collectionWithInfoSchema } from '../../models/collection-with-info';

export const deleteCollectionResponseSchema = collectionWithInfoSchema;

export type DeleteCollectionResponse = z.infer<
  typeof deleteCollectionResponseSchema
>;
