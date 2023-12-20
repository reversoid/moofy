import { fullCollectionSchema } from 'src/modules/collection/models/full-collection';
import { z } from 'zod';

export const getPersonalCollectionResponseSchema = fullCollectionSchema;

export type GetPersonalCollectionResponse = z.infer<
  typeof getPersonalCollectionResponseSchema
>;
