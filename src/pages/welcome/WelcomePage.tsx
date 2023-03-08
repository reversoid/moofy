import CreateListModal from '@/features/list/components/CreateListModal/CreateListModal';
import List from '@/features/list/components/List/List';
import { $lists, $listsState, getLists } from '@/models/lists';
import { loadMoreLists, loadMoreListsFx } from '@/models/lists/loadMoreLists';
import { Link } from '@/shared/ui/Link';
import { LinkTab } from '@/shared/ui/LinkTab/LinkTab';
import { Tabs } from '@mui/material';
import { Button, Grid, Loading, Row, Text, styled } from '@nextui-org/react';
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
  const { lists, loading: listsLoading } = useStore($listsState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadMoreLoading = useStore(loadMoreListsFx.pending);

  const handleLoadMore = () => {
    if (loadMoreLoading) {
      return;
    }
    loadMoreLists({ lowerBound: lists.nextKey! });
  };

  const [value, setValue] = useState(1);

  return (
    <>
      <Text h1 css={{ mb: '$12' }}>
        Добро пожаловать!
      </Text>
      <Row align="center" justify="flex-start" css={{ gap: '$8' }}>
        <Tabs
          value={value}
          onChange={(e, newValue) => setValue(newValue)}
          sx={{
            width: '100%',
            '& .MuiTabs-indicator': {
              backgroundColor: '#ffd131',
              height: '3px',
            },
            mb: '0.625rem',
          }}
        >
          <LinkTab to="/" label="Мои коллекции" />
          <LinkTab to="/abc" label="Избранное" />
          <LinkTab to="/abc" label="Удаленное" />
        </Tabs>

        {/* <Text h2>Ваши коллекции</Text> */}
        {listsLoading && <Loading size="md" type="default" />}
      </Row>
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
            {loadMoreLoading ? (
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
