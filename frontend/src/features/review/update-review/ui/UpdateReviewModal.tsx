import ReviewModal, { ReviewFormData } from '../../ui/ReviewModal';
import { clearState } from '../model';
import { useUpdateReview } from '../lib/useUpdateReview';

interface UpdateReviewModalProps {
  isOpen: boolean;
  setIsOpen: (newValue: boolean) => void;
  reviewId: number;
  formData: ReviewFormData;
}

const UpdateReviewModal = ({
  isOpen,
  setIsOpen,
  reviewId,
  formData,
}: UpdateReviewModalProps) => {

  const { data, isLoading, isSuccess, mutate } = useUpdateReview();
  return (
    <ReviewModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      form={formData}
      handlers={{
        onSubmit({ description, score }) {
          return mutate({
            description,
            score: score === null ? score : Number(score),
            reviewId,
          });
        },
        onSuccess() {
          setIsOpen(false);
          clearState();
        },
      }}
      state={{
        loading:isLoading,
        success:isSuccess,
      }}
    />
  );
};

export default UpdateReviewModal;
