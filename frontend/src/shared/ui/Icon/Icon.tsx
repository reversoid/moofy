import { Image } from '@nextui-org/react';
import React, { FC } from 'react';

export interface IconProps {
  iconUrl: string;
  /** Sets the width and height as one value */
  size?: string;
  width?: string;
  height?: string;
}


// TODO make 1.75rem reusable
export const Icon: FC<IconProps> = (props) => {
  return (
    <Image
      src={props.iconUrl}
      width={props.size ?? props.width ?? '1.75rem'}
      height={props.size ?? props.height ?? '1.75rem'}
    />
  );
};
