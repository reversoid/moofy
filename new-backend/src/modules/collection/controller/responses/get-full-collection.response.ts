import { z } from 'zod';
import { fullCollectionSchema } from '../../models/full-collection';

export const getFullCollectionResponseSchema = fullCollectionSchema;

export type GetFullCollectionResponse = z.infer<
  typeof getFullCollectionResponseSchema
>;
