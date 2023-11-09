import { notify } from '@/app';
import { ReviewItem } from '@/entities/Review';
import { useDeleteReview } from '@/features/review/delete-review';
import { ReviewOwnerActions } from '@/features/review/review-owner-actions';
import UpdateReviewModal from '@/features/review/update-review/ui/UpdateReviewModal';
import { Review as IReview } from '@/shared/api/types/review.type';
import { generateFilmLink } from '@/shared/utils/film-links';
import { FC, memo, useState } from 'react';

export interface ReviewProps {
  review: IReview;
  isUserOwner: boolean;
}

export const Review: FC<ReviewProps> = memo(({ review, isUserOwner }) => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const deleteMutation = useDeleteReview();

  const copyLinkToFilm = () => {
    const filmId = review.film.id;
    const link = generateFilmLink(filmId);
    navigator.clipboard.writeText(link);
    notify('Ссылка скопирована!');
  };

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
              onClickDelete={() => {
                deleteMutation.mutate(review.id);
              }}
              onClickUpdate={() => setUpdateModalOpen(true)}
              onClickShare={copyLinkToFilm}
            />
          ) : undefined
        }
      />
    </>
  );
});
