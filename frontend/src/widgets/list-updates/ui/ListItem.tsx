import { RowListItem } from '@/entities/row-list-item';
import { ListWithAdditionalInfo } from '@/shared/api/types/list.type';
import React, { FC } from 'react';
import { styled } from '@nextui-org/react';
import { MarkerRound } from '@/shared/ui/MarkerRound';

const Wrapper = styled('div', {
  position: 'relative',
});

export const ListItem: FC<{ list: ListWithAdditionalInfo }> = ({ list }) => {
  const showUnseenMarker = list.additionalInfo?.isUpdatedSinceLastView;

  return (
    <Wrapper>
      <RowListItem
        list={list.list}
        titleMarker={showUnseenMarker ? <MarkerRound /> : undefined}
      />
    </Wrapper>
  );
};
