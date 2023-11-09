import { useCallback, useEffect, useState } from 'react';
import { useRandomReview } from './useRandomReview';
import { Criteria } from '../api';

export const useRandomModal = () => {
  const type: Criteria = 'ALL';
  const { review, isLoading, refetch } = useRandomReview(type);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
