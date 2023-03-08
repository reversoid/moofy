import React, { FC, PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Link } from '../Link';
import { styled } from '@nextui-org/react';

interface LinkTabProps {
  label?: string;
  to: string;
}

const StyledTab = styled(Tab, {
  fontFamily: '$sans !important',
  fontWeight: '700 !important',
  fontSize: '$2xl !important',
  color: '$text !important',
  textTransform: 'none !important',
  display: 'block !important',
  textAlign: 'initial !important',
});

export const LinkTab = (props: LinkTabProps) => {
  return (
    <StyledTab
      onClick={(e) => e.preventDefault()}
      component={Link}
      {...props}
    />
  );
};
