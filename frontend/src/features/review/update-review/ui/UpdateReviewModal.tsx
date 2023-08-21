import ReviewModal, { ReviewFormData } from '../../ui/ReviewModal';
import { useUpdateReview } from '../utils/useUpdateReview';

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
  const { isLoading, isSuccess, mutateAsync } = useUpdateReview();

  return (
    <ReviewModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      form={formData}
      handlers={{
        async onSubmit({ description, score }) {
          await mutateAsync({
            description,
            score: score === null ? score : Number(score),
            reviewId,
          });
        },
        onSuccess() {
          setIsOpen(false);
        },
      }}
      state={{
        loading: isLoading,
        success: isSuccess,
      }}
    />
  );
};

export default UpdateReviewModal;
