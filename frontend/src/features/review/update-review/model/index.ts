import { List } from '@/shared/api/types/list.type';
import { Review } from '@/shared/api/types/review.type';
import { createEvent } from 'effector';

/** This event is emitted when the review is updated */
export const updateReview = createEvent<{ review: Omit<Review, 'film'>; list: List }>();
