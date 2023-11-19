import { z } from 'zod';
import { collectionWithInfoSchema } from '../../models/collection-with-info';

export const getCollectionResponseSchema = collectionWithInfoSchema;

export type GetCollectionResponse = z.infer<typeof getCollectionResponseSchema>;
