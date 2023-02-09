import React from 'react';
import { Tooltip, Button, Image } from '@nextui-org/react';
import infoIcon from '@/assets/img/info.svg';

const InfoIconWithTooltip = ({ message }: { message: string }) => {
  return (
    <Tooltip color="invert" content={message} placement="leftStart">
      <Button light css={{ p: 0, m: 0, width: 20, height: 20, minWidth: 0 }}>
        <Image src={infoIcon} alt="Info icon" width={'1.5rem'} height={'1.5rem'} />
      </Button>
    </Tooltip>
  );
};

export default InfoIconWithTooltip;
