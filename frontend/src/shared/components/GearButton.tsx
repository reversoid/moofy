import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { ButtonProps } from '@nextui-org/react';
import { forwardRef } from 'react';
import gear from '@/shared/assets/img/gear.svg';

export const GearButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <IconButton ref={ref} {...props} iconUrl={gear} />;
  },
);

export default GearButton;
