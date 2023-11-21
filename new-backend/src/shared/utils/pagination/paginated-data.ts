import { ZodSchema, z } from 'zod';

export const getPaginatedDataSchema = <T>(data: ZodSchema<T>) =>
  z.object({
    items: z.array(data),
    nextKey: z.string().nullable(),
  });

export type PaginatedData<T> = {
  items: T[];
  nextKey: string | null;
};