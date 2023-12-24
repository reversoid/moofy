import { z } from 'zod';

export const getUnseenAmountResponseSchema = z.object({
  amount: z.number().int(),
});

export type GetUnseenAmountResponse = z.infer<
  typeof getUnseenAmountResponseSchema
>;
