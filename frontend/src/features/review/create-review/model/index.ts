import { List } from '@/shared/api/types/list.type';
import { Review } from '@/shared/api/types/review.type';
import { createEvent } from 'effector';

/** This event is emitted when review is created */
export const createReview = createEvent<{ review: Review; list: List }>();
