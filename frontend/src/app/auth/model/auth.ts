import { createEvent } from 'effector';

/** Set app state as authorized */
export const authorize = createEvent<{ userId: number }>();

/** Set app state as unAuthorized */
export const logout = createEvent<void>();

/** Is used for checking user auth status */
export const checkoutUser = createEvent();
