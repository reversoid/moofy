import { List } from '@/shared/api/types/list.type';
import { Review } from '@/shared/api/types/review.type';
import { IterableResponse } from '@/shared/api/types/shared';
import { ListStore } from '.';

export function deleteReviewById(reviews: Review[], id: number) {
  return reviews.filter((item) => item.id !== id);
}

export function updateReviewInList(reviews: Review[], newReview: Review) {
  const reviewToUpdateIndex = reviews.findIndex(
    (r) => r.id === newReview.id,
  );
  if (reviewToUpdateIndex === -1) {
    return reviews;
  }

  const updatedItems = [...reviews];
  const film = reviews[reviewToUpdateIndex].film;
  updatedItems[reviewToUpdateIndex] = { ...newReview, film };
  return updatedItems;
}
