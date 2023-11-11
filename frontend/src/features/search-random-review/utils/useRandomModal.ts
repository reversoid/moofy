import { useCallback, useEffect, useState } from 'react';
import { useRandomReview } from '@/features/search-random-review/utils/useRandomReview';
import { Criteria } from '@/features/search-random-review/api';
import { notify } from '@/app';

export const useRandomModal = () => {
  const type: Criteria = 'ALL';

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { review, isLoading, refetch } = useRandomReview({
    type,
    onSeenAllReviews: () => {
      setIsModalOpen(false);
      notify('Все обзоры просмотрены');
    },
  });

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    refetch,
    review,
    isLoading,
    isModalOpen,
    setIsOpen: setIsModalOpen,
    handleOpenModal,
    handleCloseModal,
  };
};
