import { Card } from '@/shared/ui/Card';
import { styled } from '@nextui-org/react';

export const ReviewWrapper = styled(Card, {
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
  gap: '$6',
  padding: '$6',
  '@xsMax': {
    flexDirection: 'column',
    paddingTop: '$7',
    paddingBottom: '$7',
  },
  position: 'relative',
});
