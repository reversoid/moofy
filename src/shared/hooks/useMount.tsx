import { useEffect, useRef } from 'react';

export const useMount = (
  callback: () => void,
  ignoreDoubleCallInDevMode = true,
) => {
  const rerendersCount = useRef(1);

  // TODO create env for checking if dev mode
  const RERENDERS_AMOUNT = 2;

  useEffect(() => {
    if (!ignoreDoubleCallInDevMode) {
      callback();
      return;
    }

    if (rerendersCount.current === RERENDERS_AMOUNT) {
      callback();
    } else {
      rerendersCount.current++;
    }
  }, []);
};
