import { Profile } from '@/shared/api/types/profile.type';
import { createEvent } from 'effector';

/** Set app state as authorized with profile*/
export const authorize = createEvent<{ profile: Profile }>();

/** Set current user profile */
export const setCurrentUserProfile = authorize;

/** Set app state as unAuthorized */
export const unAuthorize = createEvent<void>();

/** Is used for checking user auth status */
export const checkoutUser = createEvent();
