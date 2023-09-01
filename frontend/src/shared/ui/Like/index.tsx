import React, { FC, useLayoutEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import { IconButton } from '../IconButton/IconButton';
import { styled } from '@nextui-org/react';

export interface HeartProps {
  loading: boolean;
  liked: boolean;
  onChange: (liked: boolean) => void;
}

const IconButtonStyled = styled(IconButton, {
  width: '3rem !important',
  height: '3rem !important',
  position: 'relative',
});

export const Heart: FC<HeartProps> = ({ liked, loading, onChange }) => {
  const [longLoading, setLongLoading] = useState(false);
  const timer = useRef<NodeJS.Timeout>();

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
    <IconButtonStyled onClick={handleClick} disabled={loading}>
      <div className={styles['heart-wrapper']}>
        <div
          className={[
            styles['heart'],
            classes.map((c) => styles[c]).join(' '),
          ].join(' ')}
        ></div>
      </div>
    </IconButtonStyled>
  );
};
