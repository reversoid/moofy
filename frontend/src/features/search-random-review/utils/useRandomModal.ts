import { notify } from '@/app';
import { useRandomReview } from '@/features/search-random-review/utils/useRandomReview';
import { useEffect, useState } from 'react';

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
