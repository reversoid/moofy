import { Tabs } from '@mui/material';
import React, { ComponentPropsWithRef, forwardRef } from 'react';

type MuiTabsProps = ComponentPropsWithRef<typeof Tabs>;
type MuiTabsRef =
  | ((instance: HTMLButtonElement | null) => void)
  | React.RefObject<HTMLButtonElement>
  | null
  | undefined;

export const StyledTabs = forwardRef<MuiTabsRef, MuiTabsProps>((props, ref) => {
  return (
    <Tabs
      {...{
        variant: 'scrollable',
        scrollButtons: false,
        ...props,
        sx: {
          width: '100%',
          '& .MuiTabs-indicator': {
            backgroundColor: '#ffd131 !important',
            height: '3px !important',
          },
          '& .MuiTabs-flexContainer': {
            gap: '2rem !important',
          },
          ...props.sx
        },
      }}
    />
  );
});
