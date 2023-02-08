import List from '@/features/list/components/List/List';
import { Grid, Text } from '@nextui-org/react';
import { $lists, getLists } from '@/models/lists';
import { useStore } from 'effector-react';
import { memo, useEffect } from 'react';
import { Link } from '@/shared/ui/Link';

const WelcomePage = () => {
  useEffect(getLists, []);
  const lists = useStore($lists);

  return (
    <>
      <Text h1 css={{ mb: '$12' }}>
        Добро пожаловать!
      </Text>
      <Text h2>Ваши списки фильмов</Text>
      <Grid.Container gap={2} justify="flex-start">
        <Grid xs={6} sm={3} css={{ '@xsMax': { padding: '$4' } }}>
          <List text="Создать список" />
        </Grid>

        {lists.items.map((item) => (
          <Grid
            xs={6}
            sm={3}
            key={item.id}
            css={{ '@xsMax': { padding: '$4' } }}
          >
            <Link to={'/list/' + item.id}>
              <List text={item.name} id={item.id} isPublic={item.is_public} />
            </Link>
          </Grid>
        ))}
      </Grid.Container>
    </>
  );
};

export default memo(WelcomePage);
