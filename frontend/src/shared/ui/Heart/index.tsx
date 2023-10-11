import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import { IconButton } from '../IconButton/IconButton';
import { CSS, styled } from '@nextui-org/react';
import { useMount } from '@/shared/hooks/useMount';

/** Provides ref to disable animation on first render */
const useHeartRef = (trigger: unknown) => {
  const heartRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (heartRef.current) {
      heartRef.current.classList.remove(styles['no-animation']);
    }
  }, [trigger]);

  useLayoutEffect(() => {
    if (heartRef.current) {
      heartRef.current.classList.add(styles['no-animation']);
    }
  }, []);

  return heartRef;
};

export interface HeartProps {
  loading: boolean;
  liked: boolean;
  onChange: (liked: boolean) => void;
  css?: CSS;
  isBlack?: boolean;
}

const IconButtonStyled = styled(IconButton, {
  width: '3rem !important',
  height: '3rem !important',
  position: 'relative',
});

export const Heart: FC<HeartProps> = ({
  liked,
  loading,
  onChange,
  css,
  isBlack,
}) => {
  const [longLoading, setLongLoading] = useState(false);
  const timer = useRef<NodeJS.Timeout>();

  const heartRef = useHeartRef(loading);

  const classes = [
    liked ? 'liked' : 'unliked',
    loading ? 'loading' : undefined,
    longLoading ? 'long-loading' : undefined,
  ].filter(Boolean) as string[];

  useLayoutEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    if (loading) {
      timer.current = setTimeout(() => {
        setLongLoading(true);
      }, 500);
    } else {
      setLongLoading(false);
    }
  }, [loading]);

  const handleClick = () => {
    onChange(!liked);
  };

  return (
    <IconButtonStyled css={css} onClick={handleClick} disabled={loading}>
      <div
        className={[
          styles['heart-wrapper'],
          styles[isBlack ? 'black' : 'default'],
        ].join(' ')}
      >
        <div
          ref={heartRef}
          className={[
            styles['heart'],
            classes.map((c) => styles[c]).join(' '),
          ].join(' ')}
        ></div>
      </div>
    </IconButtonStyled>
  );
};
