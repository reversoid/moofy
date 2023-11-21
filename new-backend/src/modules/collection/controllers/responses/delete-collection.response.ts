import { z } from 'zod';

export const deleteCollectionResponseSchema = z.object({
  id: z.number().int(),
});

export type DeleteCollectionResponse = z.infer<
  typeof deleteCollectionResponseSchema
>;
