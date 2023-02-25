import CreateListModal from '@/features/list/components/CreateListModal/CreateListModal';
import List from '@/features/list/components/List/List';
import { $lists, getLists } from '@/models/lists';
import { loadMoreLists, loadMoreListsFx } from '@/models/lists/loadMoreLists';
import { Link } from '@/shared/ui/Link';
import { Button, Grid, Loading, Text, styled } from '@nextui-org/react';
import { useStore } from 'effector-react';
import { memo, useEffect, useState } from 'react';

const LoadMoreContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mt: '$10',
});

const WelcomePage = () => {
  useEffect(getLists, []);
  const lists = useStore($lists);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loading = useStore(loadMoreListsFx.pending);

  const handleLoadMore = () => {
    if (loading) {
      return;
    }
    loadMoreLists({ lowerBound: lists.nextKey! });
  };

  return (
    <>
      <Text h1 css={{ mb: '$12' }}>
        Добро пожаловать!
      </Text>
      <Text h2>Ваши коллекции</Text>
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
        <Grid
          xs={6}
          sm={3}
          css={{ '@xsMax': { padding: '$3' } }}
          onClick={() => setIsModalOpen(true)}
        >
          <List text="Создать коллекцию" />
        </Grid>

        {lists.items.map((item) => (
          <Grid
            xs={6}
            sm={3}
            key={item.id}
            css={{ '@xsMax': { padding: '$3' } }}
          >
            <Link to={'/list/' + item.id}>
              <List text={item.name} id={item.id} isPublic={item.is_public} />
            </Link>
          </Grid>
        ))}
      </Grid.Container>
      {lists.nextKey && (
        <LoadMoreContainer>
          <Button color="gradient" onPress={handleLoadMore}>
            {loading ? (
              <Loading type="points" color="white" />
            ) : (
              'Загрузить больше'
            )}
          </Button>
        </LoadMoreContainer>
      )}
      <CreateListModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
};

export default memo(WelcomePage);
