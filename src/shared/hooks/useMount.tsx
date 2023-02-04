import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

// TODO create env for checking if dev mode
const RERENDERS_AMOUNT = 2;

export const useMount = (callback: EffectCallback, deps?: DependencyList) => {
  const rerendersCount = useRef(1);

  useEffect(() => {
    if (rerendersCount.current >= RERENDERS_AMOUNT) {
      callback();
    } else {
      rerendersCount.current++;
    }
  }, deps ?? []);
};
