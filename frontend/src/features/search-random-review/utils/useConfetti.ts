import { useEffect, useState } from 'react';

export const useConfetti = (isLoading: boolean, isModalOpen: boolean) => {
  const [confettiArray, setConfettiArray] = useState<number[]>([]);

  useEffect(() => {
    if (!isLoading && isModalOpen) {
      setConfettiArray([...confettiArray, Date.now()]);
    }
    if (confettiArray.length > 2) {
      setConfettiArray([]);
    }
  }, [isLoading]);

  return {
    confettiArray,
    setConfettiArray,
  };
};
