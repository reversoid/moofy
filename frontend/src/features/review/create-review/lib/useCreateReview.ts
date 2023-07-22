import { useMutation } from '@tanstack/react-query';
import { CreateReviewDTO, reviewService } from '../../api/review.service';
import { addReview } from '@/pages/list/ListPage/model/addReview';

export const useCreateReview = () => {
  const mutation = useMutation({
    mutationFn: (dto: CreateReviewDTO) => reviewService.createReview(dto),
    onSuccess(data) {
      addReview(data);
    },
  });
  return mutation
};
