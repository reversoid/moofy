import { fullCollectionSchema } from 'src/modules/collection/models/full-collection';
import { z } from 'zod';

export const createPersonalCollectionResponseSchema = fullCollectionSchema;

export type CreatePersonalCollectionResponse = z.infer<
  typeof createPersonalCollectionResponseSchema
>;
