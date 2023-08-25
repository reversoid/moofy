import React, { FC } from 'react';
import burgerClasses from './burger.module.css';
import { IconButton } from '@/shared/ui/IconButton/IconButton';

interface BurgerButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const BurgerButton: FC<BurgerButtonProps> = ({ onClick, isOpen }) => {
  return (
    <IconButton
      css={{ width: '50px', height: '50px', '@media(min-width: 651px)': { display: 'none' } }}
      onClick={onClick}
    >
      <div
        className={[
          burgerClasses['menu-burger'],
          burgerClasses[isOpen ? 'open-menu' : 'close-menu'],
        ].join(' ')}
      >
        <span></span>
      </div>
    </IconButton>
  );
};
