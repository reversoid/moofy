import { Link } from '@/shared/ui/Link/Link';
import { Text, styled } from '@nextui-org/react';
import { FC } from 'react';

const StatCounterContainer = styled(Link, {
  width: '5.25rem',
  '&:hover': {
    '*': {
      color: '$link',
    },
  },
});

interface StatCounterProps {
  amount: number;
  title: string;
  link: string
}

export const StatCounter: FC<StatCounterProps> = ({ amount, title, link }) => {
  return (
    <StatCounterContainer to={link}>
      <Text css={{ fontWeight: '700', textAlign: 'center' }} size={'$xl'}>
        {amount.toLocaleString()}
      </Text>
      <Text css={{ textAlign: 'center' }}>{title}</Text>
    </StatCounterContainer>
  );
};
