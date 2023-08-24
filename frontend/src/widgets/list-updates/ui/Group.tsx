import React, { FC } from 'react';
import { GroupedLists } from '../utils/get-group-lists-by-date-text';
import { styled } from '@nextui-org/react';
import { GroupDate } from './GroupDate';
import { Stack } from '@/shared/ui/Stack';
import { ListItem } from './ListItem';

const Wrapper = styled('div');

export const Group: FC<{ group: GroupedLists }> = ({ group }) => {
  return (
    <>
      <Wrapper>
        <GroupDate>{group.dateText}</GroupDate>

        <Stack>
          {group.lists.map((l) => (
            <ListItem list={l} key={l.list.id} />
          ))}
        </Stack>
      </Wrapper>
    </>
  );
};
