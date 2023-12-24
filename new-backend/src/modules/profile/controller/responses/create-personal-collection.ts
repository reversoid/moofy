import { collectionWithInfoSchema } from 'src/modules/collection/models/collection-with-info';
import { z } from 'zod';

export const createPersonalCollectionResponseSchema = collectionWithInfoSchema;

export type CreatePersonalCollectionResponse = z.infer<
  typeof createPersonalCollectionResponseSchema
>;
