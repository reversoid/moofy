import React from 'react';
import { Tooltip, Button } from '@nextui-org/react';
import Image from 'next/image';

const InfoIconWithTooltip = ({ message }: { message: string }) => {
  return (
    <Tooltip color="invert" content={message} placement="leftStart">
      <Button light css={{ p: 0, m: 0, width: 20, height: 20, minWidth: 0 }}>
        <Image src="/img/info.svg" alt="Info icon" width={20} height={20} />
      </Button>
    </Tooltip>
  );
};

export default InfoIconWithTooltip;
