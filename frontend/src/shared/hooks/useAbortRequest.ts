import { useState } from 'react';
import { useUnmount } from './useUnmount';

/** Provides signal and callback to cancel the request */
export const useAbortRequest = () => {
  const [controller, setController] = useState(new AbortController());

  const cancelRequest = () => {
    controller.abort();
    setController(new AbortController());
  };

  useUnmount(() => {
    cancelRequest();
  });

  return {
    signal: controller.signal,
    cancelRequest,
  };
};
