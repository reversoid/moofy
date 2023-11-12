import { useCallback, useEffect, useRef, useState } from 'react';

export const useConfetti = (isLoading: boolean, isModalOpen: boolean) => {
  const [confettiArray, setConfettiArray] = useState<number[]>([]);
  const countRef = useRef(1);

  const removeConfettiByKey = useCallback(
    (key: number) => setConfettiArray((arr) => arr.filter((k) => k !== key)),
    [],
  );

  const clearAllConfetti = () => {
    setConfettiArray([]);
  };

  useEffect(() => {
    if (!isLoading && isModalOpen) {
      setConfettiArray((oldArray) => {
        const newArray = [...oldArray, countRef.current++];
        if (newArray.length > 2) {
          return newArray.slice(1);
        }
        return newArray;
      });
    }
  }, [isLoading]);

  return {
    confettiArray,
    removeConfettiByKey,
    clearAllConfetti,
  };
};
