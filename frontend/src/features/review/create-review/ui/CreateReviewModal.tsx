import { Film } from '@/shared/api/types/film.type';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewModal from '../../_ui/ReviewModal';
import { useCreateReview } from '../lib/useCreateReview';
import { clearState } from '../model';

export interface CreateReviewModalProps {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  film?: Film;
  listId: number;
}

const CreateReviewModal = ({
  isOpen,
  setIsOpen,
  film,
  listId,
}: CreateReviewModalProps) => {
  const navigate = useNavigate();

  const { data, isLoading, isSuccess, mutate } = useCreateReview();

  return (
    <ReviewModal
      handlers={{
        onSubmit({ description, score }) {
          return mutate({
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
      state={{ loading: isLoading, success: isSuccess }}
    />
  );
};

export default memo(CreateReviewModal);
