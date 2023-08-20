import { useMutation } from '@tanstack/react-query';
import { CreateReviewDTO, reviewService } from '../../api/review.service';
import { createReview } from '../model';

export const useCreateReview = () => {
  const mutation = useMutation({
    mutationFn: (dto: CreateReviewDTO) => reviewService.createReview(dto),
    onSuccess(data) {
      createReview(data);
    },
  });
  return mutation
};
