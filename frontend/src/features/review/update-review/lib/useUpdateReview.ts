import { useMutation } from '@tanstack/react-query';
import { UpdateReviewDTO, reviewService } from '../../api/review.service';
import { updateReview } from '@/pages/list/ListPage/model/updateReview';

export const useUpdateReview = () => {
  const mutation = useMutation({
    mutationFn: (dto: UpdateReviewDTO) => reviewService.updateReview(dto),
    onSuccess(data) {
      updateReview(data);
    },
  });
  return mutation
};