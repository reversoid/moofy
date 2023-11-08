import { useEffect, useMemo, useState } from 'react';
import { useRandomReview } from './useRandomReview';
import { Criteria } from '../api';
import { Option } from '@/shared/ui/Dropdown/Dropdown';

export const useControllRandomReview = () => {
  const type: Criteria = 'ALL';
  const { review, isLoading, refetch } = useRandomReview(type);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (review) {
      setIsOpen(true);
    }
  }, [review]);

  return {
    refetch,
    review,
    isLoading,
    isOpen,
    setIsOpen
  };
};
