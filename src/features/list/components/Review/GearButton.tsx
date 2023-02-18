import { IconButton } from '@/shared/ui/IconButton';
import { styled, Image, ButtonProps } from '@nextui-org/react';
import React, { forwardRef } from 'react';
import gear from '@/assets/img/gear.svg';

const EditButton = styled(IconButton, {
  position: 'absolute',
  top: '$sm',
  right: '$sm',
});

const GearButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <EditButton light ref={ref} {...props}>
      <Image src={gear} width={'1.5rem'} height={'1.5rem'} />
    </EditButton>
  );
});

export default GearButton;
