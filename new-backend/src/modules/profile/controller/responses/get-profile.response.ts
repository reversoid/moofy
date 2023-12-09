import { z } from 'zod';
import { profileSchema } from '../../models/profile';

export const getProfileResponseSchema = profileSchema;

export type GetProfileResponse = z.infer<typeof getProfileResponseSchema>;
