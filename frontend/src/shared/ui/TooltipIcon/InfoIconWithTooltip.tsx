import React, { FC } from 'react';
import { Tooltip, Button, Image } from '@nextui-org/react';

interface TooltipIconProps {
  message: string;
  iconSrc: string;
}

const TooltipIcon: FC<TooltipIconProps> = ({ iconSrc, message }) => {
  return (
    <Tooltip color="invert" content={message} placement="leftStart">
      <Button light css={{ p: 0, m: 0, width: 20, height: 20, minWidth: 0 }}>
        <Image
          src={iconSrc}
          alt="Info icon"
          width={'1.5rem'}
          height={'1.5rem'}
        />
      </Button>
    </Tooltip>
  );
};

export default TooltipIcon;
