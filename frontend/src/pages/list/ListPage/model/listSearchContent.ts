import { createEvent, createStore } from 'effector';
import { Review } from '@/shared/api/types/review.type';
import { deleteReview } from '@/features/review/delete-review';

export const setSearchReviews = createEvent<{
  reviews: Review[];
}>();

export const clearSearchReviews = createEvent<void>();

export const $searchReviews = createStore<Review[] | null>(null);

$searchReviews.on(setSearchReviews, (state, { reviews }) => reviews);

$searchReviews.on(deleteReview, (state, { reviewId }) => {
  return state?.filter((review) => review.id !== reviewId);
});

$searchReviews.on(clearSearchReviews, () => null);
