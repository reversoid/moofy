import { z } from 'zod';
import { collectionSchema } from '../../models/collection';

export const addToFavoriteCollectionResponse = collectionSchema;

export type AddToFavoriteResponse = z.infer<
  typeof addToFavoriteCollectionResponse
>;
