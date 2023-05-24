import ReviewModal, { ReviewFormData } from '../../_ui/ReviewModal';
import { useStore } from 'effector-react';
import { $updateReviewState, clearState, updateReview } from '../model';

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
  const { loading, success } = useStore($updateReviewState);

  return (
    <ReviewModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      form={formData}
      handlers={{
        onSubmit({ description, score }) {
          return updateReview({
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
        loading,
        success,
      }}
    />
  );
};

export default UpdateReviewModal;
