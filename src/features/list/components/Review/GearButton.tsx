import { IconButton } from '@/shared/ui/IconButton';
import { Image, ButtonProps } from '@nextui-org/react';
import React, { forwardRef } from 'react';
import gear from '@/assets/img/gear.svg';

const GearButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <IconButton ref={ref} {...props}>
      <Image src={gear} width={'1.5rem'} height={'1.5rem'} />
    </IconButton>
  );
});

export default GearButton;
