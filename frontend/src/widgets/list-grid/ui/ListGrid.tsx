import { Grid, styled } from '@nextui-org/react';
import { FC, memo } from 'react';
import { List as IList } from '@/shared/api/types/list.type';
import { Link } from '@/shared/ui/Link/Link';
import { List } from '@/entities/List';
import LoadMore from '@/shared/components/LoadMore';

const GridStyled = styled(Grid, { '@xsMax': { padding: '$3' } });

export interface ListGridProps {
  items: IList[];
  /** Item that is displayed before other items in list */
  firstItem?: JSX.Element;
  loadMore?: () => void;
  canLoadMore?: boolean;
  loadingMore?: boolean;
}

const ListGrid: FC<ListGridProps> = ({
  items,
  firstItem,
  canLoadMore,
  loadMore,
  loadingMore,
}) => {
  return (
    <>
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
              <List text={item.name} id={item.id} isPublic={item.is_public} imageUrl={item.image_url} />
            </Link>
          </GridStyled>
        ))}
      </Grid.Container>

      {canLoadMore && <LoadMore loadMore={loadMore} loading={loadingMore} />}
    </>
  );
};

export default memo(ListGrid);
