import { filmSchema } from 'src/modules/film/models/film';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';

export const searchFilmsResponseSchema = createPaginatedDataSchema(filmSchema);

export type SearchFilmsResponse = z.infer<typeof searchFilmsResponseSchema>;
