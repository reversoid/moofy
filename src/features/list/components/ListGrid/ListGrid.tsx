import { Grid, styled } from '@nextui-org/react';
import React, { FC, memo } from 'react';
import List from '../List/List';
import { List as IList } from '@/shared/api/types/list.type';
import { Link } from '@/shared/ui/Link';

const GridStyled = styled(Grid, { '@xsMax': { padding: '$3' } });

export interface ListGridProps {
  items: IList[];
  /** Item that is displayed before other items in list */
  firstItem?: JSX.Element;
}

const ListGrid: FC<ListGridProps> = ({ items, firstItem }) => {
  return (
    <Grid.Container
      gap={2}
      justify="flex-start"
      css={{
        '@xsMax': {
          paddingLeft: 0,
          width: '100% !important',
          margin: '0 !important',
          paddingRight: 0,
          pt: 0,
        },
      }}
    >
      {firstItem && (
        <GridStyled xs={6} sm={3}>
          {firstItem}
        </GridStyled>
      )}

      {items.map((item) => (
        <GridStyled xs={6} sm={3} key={item.id}>
          <Link to={'/list/' + item.id}>
            <List text={item.name} id={item.id} isPublic={item.is_public} />
          </Link>
        </GridStyled>
      ))}
    </Grid.Container>
  );
};

export default memo(ListGrid);
