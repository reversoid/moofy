import List from '@/features/list/components/List';
import { Grid, Text } from '@nextui-org/react';

const list = [
  {
    title: 'Orange',
    img: '/images/fruit-1.jpeg',
  },
  {
    title: 'Tangerine',
    img: '/images/fruit-2.jpeg',
  },
  {
    title: 'Cherry',
    img: '/images/fruit-3.jpeg',
  },
];

const WelcomePage = () => {
  return (
    <>
      <Text h1 css={{ mb: '$12' }}>
        Добро пожаловать!
      </Text>
      <Text h2>Ваши списки фильмов</Text>
      <Grid.Container gap={2} justify="flex-start">
        <Grid xs={6} sm={3} css={{ '@xsMax': { padding: '$4' } }}>
          <List link="/list/new" text="Создать список" />
        </Grid>

        {list.map((item, index) => (
          <Grid xs={6} sm={3} key={index} css={{ '@xsMax': { padding: '$4' } }}>
            <List
              link={'/list/' + index}
              text={item.title}
              imageUrl={'https://nextui.org' + item.img}
            />
          </Grid>
        ))}
      </Grid.Container>
    </>
  );
};

export default WelcomePage;
