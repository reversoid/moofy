import { createEvent } from 'effector';

/** This event is emitted when review is deleted */
export const deleteReview = createEvent<{ reviewId: number }>();
