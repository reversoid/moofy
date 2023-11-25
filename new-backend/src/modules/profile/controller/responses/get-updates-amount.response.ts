import { z } from 'zod';

export const getUpdatesAmountResponseSchema = z.object({
  amount: z.number().int(),
});

export type GetUpdatesAmountResponse = z.infer<
  typeof getUpdatesAmountResponseSchema
>;
