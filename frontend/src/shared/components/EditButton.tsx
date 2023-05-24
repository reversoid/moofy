import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { ButtonProps } from '@nextui-org/react';
import { forwardRef } from 'react';
import edit from '@/shared/assets/img/square-edit.svg';

export const EditButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <IconButton ref={ref} {...props} iconUrl={edit} />;
  },
);

export default EditButton;
