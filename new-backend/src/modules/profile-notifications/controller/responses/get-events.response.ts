import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { profileDirectNotificationSchema } from '../../models/notifications/profile-direct-notification';
import { z } from 'zod';

export const getEventsResponseSchema = createPaginatedDataSchema(
  profileDirectNotificationSchema,
);

export type GetEventsResponse = z.infer<typeof getEventsResponseSchema>;
