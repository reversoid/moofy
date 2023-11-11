import { useState } from 'react';

export const useSeenReviewsIds = () => {
  const [seenReviewsIds, setSeenReviewsIds] = useState<Set<number>>(new Set());

  const addToSeen = (id: number) => {
    setSeenReviewsIds((oldSet) => {
      oldSet.add(id);
      return new Set(oldSet);
    });
  };

  const clearSeen = () => {
    setSeenReviewsIds(new Set());
  };

  return { seenReviewsIds, addToSeen, clearSeen };
};
