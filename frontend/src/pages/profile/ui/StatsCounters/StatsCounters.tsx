import { Row, Text, styled } from '@nextui-org/react';
import React, { FC } from 'react';
import { StatCounter } from './StatCounter';

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
          <StatCounter amount={followers} title="Подписчики" />
          <StatCounter amount={followed} title="Подписки" />
        </Row>
      </Wrapper>
    </>
  );
};
