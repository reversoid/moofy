import { Text } from '@nextui-org/react';
import React, { FC, PropsWithChildren } from 'react';

export const GroupDate: FC<PropsWithChildren> = ({ children }) => {
  return <Text h2>{children}</Text>;
};
