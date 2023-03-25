import { ExtendButtonBase, Tab, TabTypeMap } from '@mui/material';
import { styled } from '@nextui-org/react';

export const StyledTab = styled(Tab, {
  fontFamily: '$sans !important',
  fontWeight: '700 !important',
  fontSize: '$4xl !important',
  '@xsMax': {
    fontSize: '$3xl !important',
  },
  color: '$text !important',
  textTransform: 'none !important',
  display: 'block !important',
  letterSpacing: '$tighter !important',
  pl: '0.25rem !important',
  pr: '0.25rem !important',
  pt: '0 !important',
  textAlign: 'initial !important',
  width: 'fit-content !important',
}) as ExtendButtonBase<TabTypeMap<{}, 'div'>>;

