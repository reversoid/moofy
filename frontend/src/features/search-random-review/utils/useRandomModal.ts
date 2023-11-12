import { useCallback, useEffect, useState } from 'react';
import { useRandomReview } from '@/features/search-random-review/utils/useRandomReview';
import { Criteria } from '@/features/search-random-review/api';
import { notify } from '@/app';

export const useRandomModal = (listId: number) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { review, isLoading, getRandomReview } = useRandomReview({
    listId,
    onSeenAllReviews: () => {
      setIsModalOpen(false);
      notify('Все обзоры просмотрены');
    },
  });

  useEffect(() => {
    if (review && isModalOpen) {
      getRandomReview();
    }
  }, [isModalOpen]);

  return {
    getRandomReview,
    review,
    isLoading,
    isModalOpen,
    setIsModalOpen,
  };
};
