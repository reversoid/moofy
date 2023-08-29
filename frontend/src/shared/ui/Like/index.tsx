import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import styles from './styles.module.css';

export interface HeartProps {
  loading?: boolean;
  liked?: boolean;
}

export const Heart: FC<HeartProps> = ({ liked, loading }) => {
  const [classes, setClasses] = useState<string[]>([]);

  useLayoutEffect(() => {
    const classes: string[] = [
      liked ? 'liked' : undefined,
      !liked ? 'unliked' : undefined,
      loading ? 'loading' : undefined,
    ].filter(Boolean) as string[];

    setClasses(classes);
  }, [loading, liked]);

  const handleClick = () => {
    setClasses(['loading']);

    // setTimeout(() => {
    //   setClasses(['liked']);
    // }, 1000);

    setTimeout(() => {
      setClasses(['loading', 'long-loading']);
    }, 800);
  };

  return (
    <div
      onClick={handleClick}
      className={[
        styles['heart'],
        classes.map((c) => styles[c]).join(' '),
      ].join(' ')}
    ></div>
  );
};
