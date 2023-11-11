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

    horizontal: {
      true: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: '$6',
        padding: '$6',

        '@xsMax': {
          flexDirection: 'column',
          paddingTop: '$7',
          paddingBottom: '$7',
        },
        position: 'relative',
      },
    },

    vertical: {
      true: {
        display: 'flex',
        flexDirection: 'column',
        gap: '$6',
        p: '$7 $6',
      },
    },
  },
});
