import { Button, Card, Grid, Text, styled } from '@nextui-org/react';
import { ReactNode, memo } from 'react';
import bg from './img/bg.svg';
import { Link } from '@/shared/ui/Link';

const WelcomeContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  mb: '$20',
});

const InfoContainer = styled('div', {});

interface MyCardProps {
  headerGradient: string;
  header: string;
  content: ReactNode;
}
const MyCard = (props: MyCardProps) => {
  return (
    <Card css={{ p: '$6', mw: '400px' }}>
      <Card.Header>
        <img
          alt="nextui logo"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width="34px"
          height="34px"
        />
        <Grid.Container css={{ pl: '$6' }}>
          <Grid xs={12}>
            <Text
              h4
              css={{
                lineHeight: '$xs',
                textGradient: props.headerGradient,
                fontWeight: 'bold',
              }}
            >
              {props.header}
            </Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body css={{ py: '$2' }}>
        <Text>{props.content}</Text>
      </Card.Body>
    </Card>
  );
};

const MainPage = () => {
  return (
    <>
      <WelcomeContainer>
        <Text
          h1
          css={{
            textGradient: '45deg, $yellow600 -20%, $red600 100%',
            fontSize: '$6xl',
            ta: 'center',
          }}
        >
          Создавай списки фильмов
        </Text>
        <Text
          h2
          css={{
            textGradient: '45deg, $blue600 -20%, $pink600 50%',
            fontWeight: '700',
            fontSize: '$5xl',
            ta: 'center',
          }}
        >
          и делись ими с друзьями
        </Text>
        <Button
          size={'lg'}
          color={'gradient'}
          css={{ width: 'fit-content', mt: '$10' }}
        >
          Присоединиться
        </Button>
      </WelcomeContainer>
      <MyCard
        content={
          'Сервис позволяет создавать списки фильмов и делиться ими с друзьями по открытой ссылке'
        }
        header="Что посмотреть?"
        headerGradient="rgb(94, 162, 239) 25%, rgb(0, 114, 245) 100%"
      />
      <MyCard
        header="Обзоры"
        content={
          'На каждый фильм в списке можно написать краткий обзор и поставить оценку'
        }
        headerGradient="rgb(243, 101, 52) 25%, rgb(246, 159, 39) 100%"
      />
      <MyCard
        header="Приватные списки"
        content={
          'Любой ваш список можно сделать приватным, тогда никто, кроме вас, не сможет его прочесть'
        }
        headerGradient="rgb(0, 183, 250) 25%, rgb(1, 207, 234) 100%"
      />
      <MyCard
        header="Открытость"
        content={
          <>
            Каждый может предложить свою помощь в развитии проекта, подробнее:{' '}
            <Link css={{ width: 'fit-content', display: 'inline' }} to={'welcome'}>
              здесь
            </Link>
          </>
        }
        headerGradient="rgb(255, 28, 247) 25%, rgb(178, 73, 248) 100%"
      />
    </>
  );
};

export default memo(MainPage);
