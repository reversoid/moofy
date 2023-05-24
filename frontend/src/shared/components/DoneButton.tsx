import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { ButtonProps } from '@nextui-org/react';
import { forwardRef } from 'react';
import done from '@/shared/assets/img/done.svg';

export const DoneButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <IconButton ref={ref} {...props} iconUrl={done} />;
  },
);

export default DoneButton;
