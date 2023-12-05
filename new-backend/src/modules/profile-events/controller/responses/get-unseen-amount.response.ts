import { z } from 'zod';

export const getEventsAmountResponseSchema = z.object({ amount: z.number() });

export type GetEventsAmountResponse = z.infer<
  typeof getEventsAmountResponseSchema
>;
