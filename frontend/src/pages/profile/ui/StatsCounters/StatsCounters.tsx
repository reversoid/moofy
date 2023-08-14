import { Row, Text, styled } from '@nextui-org/react';
import React, { FC } from 'react';

const StatCounterContainer = styled('div', {});

interface StatCounterProps {
  amount: number;
  title: string;
}

const StatCounter: FC<StatCounterProps> = ({ amount, title }) => {
  return (
    <StatCounterContainer>
      <Text css={{ fontWeight: '700', textAlign: 'center' }} size={'$xl'}>
        {amount}
      </Text>
      <Text css={{ textAlign: 'center' }}>{title}</Text>
    </StatCounterContainer>
  );
};

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  ai: 'center',
});

interface StatsCountersProps {
  followers: number;
  followed: number;
}

export const StatsCounters: FC<StatsCountersProps> = ({
  followed,
  followers,
}) => {
  return (
    <>
      <Wrapper>
        <Row
          css={{
            display: 'flex',
            ai: 'center',
            jc: 'center',
            gap: '$10',
            background: '$accents0',
            borderRadius: '$lg',
            py: '$4',
            px: '$10',
          }}
        >
          <StatCounter amount={followed} title="Подписчики" />
          <StatCounter amount={followers} title="Подписки" />
        </Row>
      </Wrapper>
    </>
  );
};
