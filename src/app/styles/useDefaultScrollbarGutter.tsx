import { useEffect } from 'react';

export const useDefaultScrollbarGutter = () => {
  useEffect(() => {
    const html = document.querySelector('html');
    if (!html) return;

    html.style.scrollbarGutter = 'initial';

    return () => {
      html.style.scrollbarGutter = null as unknown as string;
    };
  }, []);
};
