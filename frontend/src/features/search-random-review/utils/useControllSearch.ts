import { useEffect, useMemo, useState } from 'react';
import { useRandomReview } from './useRandomReview';
import { Critarea } from '../api';
import { Option } from '@/shared/ui/Dropdown/Dropdown';

export const useControllRandomReview = (type: Critarea) => {
  const [isExploded, setIsExploded] = useState(false);
  const { review, isLoading, refetch } = useRandomReview(type);

  useEffect(() => {
    if (isExploded) {
      setIsExploded(false);
    }
  }, [isExploded]);


  return {
    refetch,
    review,
    isLoading,
    isExploded,
    setIsExploded,
  };
};
