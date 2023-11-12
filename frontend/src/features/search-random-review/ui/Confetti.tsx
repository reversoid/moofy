import React, { FC, memo } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

interface ConfettiProps {
  confettiArray: number[];
  onComplete: (key: number) => void;
}

const ConfettiConfig = {
  zIndex: 10000,
  force: 0.85,
  duration: 1600,
  particleCount: 120,
  width: 800,
  height: 800,
};

export const Confetti: FC<ConfettiProps> = memo(
  ({ confettiArray, onComplete }) => {
    return (
      <>
        {confettiArray.map((key) => (
          <ConfettiExplosion
            key={key}
            style={{
              position: 'absolute',
              top: '0',
              left: '50%',
            }}
            onComplete={() => onComplete(key)}
            {...ConfettiConfig}
          />
        ))}
      </>
    );
  },
);
