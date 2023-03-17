import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { Image, ButtonProps } from '@nextui-org/react';
import { forwardRef } from 'react';
import gear from '@/assets/img/gear.svg';

const GearButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <IconButton ref={ref} {...props}>
      <Image src={gear} width={'1.75rem'} height={'1.75rem'} />
    </IconButton>
  );
});

export default GearButton;
