import { List } from '@/shared/api/types/list.type';
import { Review } from '@/shared/api/types/review.type';
import { createEvent } from 'effector';

export const addReview = createEvent<{ list: List; review: Review }>();
