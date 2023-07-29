import { Profile } from '@/shared/api/types/profile.type';
import { createEvent } from 'effector';

/** Set app state as authorized with userId */
export const authorize = createEvent<{ userId: number }>();

/** Set current user profile */
export const setCurrentUserProfile = createEvent<{ profile: Profile }>();;

/** Set app state as unAuthorized */
export const unAuthorize = createEvent<void>();

/** Is used for checking user auth status */
export const checkoutUser = createEvent();
