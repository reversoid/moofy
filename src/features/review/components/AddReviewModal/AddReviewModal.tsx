import {
  $createReviewState,
  clearState,
  createReview,
} from '@/models/reviews/createReview';
import { Film } from '@/shared/api/types/film.type';
import { useEvent, useStore } from 'effector-react';
import { useNavigate } from 'react-router-dom';
import ReviewModal from '../ReviewModal/ReviewModal';
import { memo } from 'react';

interface AddReviewModalProps {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  film?: Film;
  listId: number;
}

const AddReviewModal = ({
  isOpen,
  setIsOpen,
  film,
  listId,
}: AddReviewModalProps) => {
  const navigate = useNavigate();
  const onSubmit = useEvent(createReview);

  const { loading, success } = useStore($createReviewState);

  return (
    <ReviewModal
      handlers={{
        onSubmit({ description, score }) {
          return onSubmit({
            filmId: film?.id ?? '-1',
            description,
            score: score === null ? score : Number(score),
            listId,
          });
        },
        onSuccess() {
          clearState();
          setIsOpen(false);
          navigate('../');
        },
      }}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      state={{ loading, success }}
    />
  );
};

export default memo(AddReviewModal);
