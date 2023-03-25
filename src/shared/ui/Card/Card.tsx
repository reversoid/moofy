import { styled } from '@nextui-org/react';

export const Card = styled('div', {
  borderRadius: '$lg',
  borderCollapse: 'separate',
  overflow: 'hidden',
  backgroundColor: '$gray50',
  transition: 'all 0.1s ease-in-out',
  position: 'relative',

  variants: {
    isHoverable: {
      true: {
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-0.2rem)',
        },
      },
    },
  },
});
