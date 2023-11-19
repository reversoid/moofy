import { z } from 'zod';
import { collectionWithInfoSchema } from '../../models/collection-with-info';

export const createCollectionResponseSchema = collectionWithInfoSchema;

export type CreateCollectionResponse = z.infer<
  typeof createCollectionResponseSchema
>;
