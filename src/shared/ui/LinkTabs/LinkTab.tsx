import { ExtendButtonBase } from '@mui/material';
import Tab, { TabTypeMap } from '@mui/material/Tab';
import { styled } from '@nextui-org/react';
import { Link } from '../Link/Link';

export interface LinkTabProps {
  label?: string;
  to: string;
}

const StyledTab = styled(Tab, {
  fontFamily: '$sans !important',
  fontWeight: '700 !important',
  fontSize: '$4xl !important',
  color: '$text !important',
  textTransform: 'none !important',
  display: 'block !important',
  letterSpacing: '$tighter !important',
  pl: '0.25rem !important',
  pr: '0.25rem !important',
  pt: '0 !important',
  textAlign: 'initial !important',
  width: 'fit-content !important'
}) as ExtendButtonBase<TabTypeMap<{}, "div">>;

export const LinkTab = (props: LinkTabProps) => {
  return (
    <StyledTab
      component={Link}
      {...props}
    />
  );
};
