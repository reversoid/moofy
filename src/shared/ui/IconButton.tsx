import { Button, ButtonProps, styled } from '@nextui-org/react';
import { forwardRef } from 'react';

const ButtonStyled = styled(Button);

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return (
      <ButtonStyled
        {...{
          ...props,
          css: {
            width: '1.75rem',
            height: '1.75rem',
            p: '0',
            minWidth: 'auto',
            flexShrink: '0',
            ...props.css,
          },
        }}
        ref={ref}
        light
        ripple={false}
      ></ButtonStyled>
    );
  },
);
