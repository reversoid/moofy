import { List } from '@/shared/api/types/list.type';
import { Image, Text, styled } from '@nextui-org/react';
import React, { FC } from 'react';

const Wrapper = styled('div', {
  d: 'flex',
  gap: '$5',
});

export const SmallList: FC<{ list: List }> = ({ list }) => {
  return (
    <Wrapper>
      <Image src={list.image_url ?? ''} width={'5rem'} height={'5rem'} />
      <Text h6>{list.name}</Text>
    </Wrapper>
  );
};
