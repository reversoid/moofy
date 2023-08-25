import { ExtendButtonBase, Tab, TabTypeMap } from '@mui/material';
import { styled } from '@nextui-org/react';

export const StyledTab = styled(Tab, {
  variants: {
    highlighted: {
      true: {
        position: 'relative',
        ':after': {
          position: 'absolute !important',
          content: '',
          top: '0',
          left: '0',
          width: '0.5rem',
          height: '0.5rem',
          background: '#f8d355dd',
          borderRadius: '50%',
        },
      },
    },
    first: {
      true: {
        px: '0 !important',
        mr: '0.5rem !important',

        '@xsMax': {
          mr: '0.25rem !important',
        },
      },
    },
  },

  fontFamily: '$sans !important',
  fontWeight: '700 !important',
  fontSize: '$4xl !important',
  '@mdMax': {
    fontSize: '$3xl !important',
  },
  color: '$text !important',
  textTransform: 'none !important',
  display: 'block !important',
  letterSpacing: '$tighter !important',
  px: '0.5rem !important',
  '@xsMax': {
    fontSize: '$3xl !important',
    px: '0.25rem !important',
  },
  pt: '0 !important',
  textAlign: 'initial !important',
  width: 'fit-content !important',
}) as ExtendButtonBase<
  TabTypeMap<{ highlighted?: boolean; first?: boolean }, 'div'>
>;
