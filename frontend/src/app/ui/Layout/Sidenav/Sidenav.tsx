import { HEADER_HEIGHT } from '@/app/utils/layoutConstants';
import { Drawer } from '@mui/material';
import React, { FC } from 'react';
import { SidenavContent } from './SidenavContent';

interface SidenavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidenav: FC<SidenavProps> = ({ isOpen, setIsOpen }) => {
  return (
    <Drawer
      sx={{
        '.MuiPaper-root': {
          width: '100vw',
          mt: HEADER_HEIGHT,
          background: 'black',
          color: 'white',
        },
      }}
      anchor={'right'}
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <SidenavContent onItemClick={() => setIsOpen(false)} />
    </Drawer>
  );
};
