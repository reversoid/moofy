import { RowListItem } from '@/entities/row-list-item';
import { ListWithAdditionalInfo } from '@/shared/api/types/list.type';
import React, { FC } from 'react';
import { styled } from '@nextui-org/react';

const Wrapper = styled('div', {
  position: 'relative',
});

export const ListItem: FC<{ list: ListWithAdditionalInfo }> = ({ list }) => {
  return (
    <Wrapper>
      <RowListItem list={list.list} />
    </Wrapper>
  );
};
