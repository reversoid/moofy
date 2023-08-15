import { Text, styled } from '@nextui-org/react';
import { FC } from 'react';

const StatCounterContainer = styled('div', {
  width: '5.25rem'
});

interface StatCounterProps {
  amount: number;
  title: string;
}

export const StatCounter: FC<StatCounterProps> = ({ amount, title }) => {
  return (
    <StatCounterContainer>
      <Text css={{ fontWeight: '700', textAlign: 'center' }} size={'$xl'}>
        {amount.toLocaleString()}
      </Text>
      <Text css={{ textAlign: 'center' }}>{title}</Text>
    </StatCounterContainer>
  );
};