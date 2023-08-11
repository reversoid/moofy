import { useMutation } from '@tanstack/react-query';
import { DeleteReviewDTO, reviewService } from '../../api/review.service';
import { deleteReview } from '../model';

export const useDeleteReview = () => {
  const mutation = useMutation({
    mutationFn: (dto: DeleteReviewDTO) => reviewService.deleteReview(dto),
    onSuccess(data) {
      deleteReview(data);
    },
  });
  return mutation
};
