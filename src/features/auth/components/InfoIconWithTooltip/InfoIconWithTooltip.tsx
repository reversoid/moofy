import React, { memo } from 'react';
import infoIcon from '@/shared/assets/img/info.svg';
import TooltipIcon from '@/shared/ui/TooltipIcon/InfoIconWithTooltip';

const InfoIconWithTooltip = ({ message }: { message: string }) => {
  return <TooltipIcon message={message} iconSrc={infoIcon} />;
};

export default memo(InfoIconWithTooltip);
