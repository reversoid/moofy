import { useMutation } from '@tanstack/react-query';
import { reviewService } from '../../api/review.service';
import { deleteReview } from '../model';
import { deleteSearchItem } from '@/pages/list/ListPage/model/listSearchContent';

export const useDeleteReview = () => {
  const mutation = useMutation({
    mutationFn: (reviewId: number) => reviewService.deleteReview(reviewId),
    onSuccess({ reviewId, list }) {
      deleteReview({ reviewId, list });
      deleteSearchItem({ listId: list.id, reviewId: reviewId });
    },
  });
  return mutation;
};
