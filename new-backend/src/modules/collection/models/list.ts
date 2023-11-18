import { z } from 'zod';

export const listSchema = z.object({ id: z.number().int() });

export type List = z.infer<typeof listSchema>;
