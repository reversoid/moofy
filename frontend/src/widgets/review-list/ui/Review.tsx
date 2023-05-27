import { ReviewItem } from '@/entities/Review';
import { deleteReview } from '@/features/review/delete-review';
import { ReviewOwnerActions } from '@/features/review/review-owner-actions';
import UpdateReviewModal from '@/features/review/update-review/ui/UpdateReviewModal';
import { Review as IReview } from '@/shared/api/types/review.type';
import { FC, memo, useState } from 'react';

export interface ReviewProps {
  review: IReview;
  isUserOwner: boolean;
}

export const Review: FC<ReviewProps> = memo(({ review, isUserOwner }) => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  return (
    <>
      <UpdateReviewModal
        formData={{ description: review.description, score: review.score }}
        reviewId={review.id}
        isOpen={updateModalOpen}
        setIsOpen={setUpdateModalOpen}
      />

      <ReviewItem
        review={review}
        topRightButton={
          isUserOwner ? (
            <ReviewOwnerActions
              onClickDelete={() => deleteReview({ reviewId: review.id })}
              onClickUpdate={() => setUpdateModalOpen(true)}
            />
          ) : undefined
        }
      />
    </>
  );
});
