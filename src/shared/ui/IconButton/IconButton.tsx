import { Button, ButtonProps, styled, Image } from '@nextui-org/react';
import { forwardRef } from 'react';

export interface IconButtonProps extends ButtonProps {
  iconUrl?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    return (
      <Button
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
      >
        {props.iconUrl && (
          <Image src={props.iconUrl} width={'1.75rem'} height={'1.75rem'} />
        )}
      </Button>
    );
  },
);
