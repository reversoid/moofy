import environment from '@/app/environment';
import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

const RERENDERS_AMOUNT = environment.RERENDER_AMOUNT;

/** Helps to avoid **React.Strictmode** double rerender */
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
