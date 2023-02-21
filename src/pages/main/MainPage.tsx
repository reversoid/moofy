import {
  Button,
  Card,
  Grid,
  Image,
  Row,
  Text,
  styled,
} from '@nextui-org/react';
import { ReactNode, memo } from 'react';
import waves from './img/waves.svg';
import { Link } from '@/shared/ui/Link';

const WelcomeContainer = styled('div', {
  pt: '$20',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundImage: `url(${waves})`,
  backgroundSize: 'auto 18rem',
  backgroundPosition: 'bottom',
  backgroundRepeat: 'repeat-x',
  paddingBottom: '25rem',
});

const FeaturesContainer = styled('div', {
  background: '#c62368',
  paddingBottom: '25rem',
  mt: '-2px'
});

const CardsContainer = styled('div', {
  display: 'flex',
  gap: '$10',
  px: '$10',
});

interface MyCardProps {
  headerGradient: string;
  header: string;
  content: ReactNode;
}
const MyCard = (props: MyCardProps) => {
  return (
    <Card css={{ p: '$6', mw: '400px', background: '#00000080' }}>
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

const Cards = () => {
  return (
    <CardsContainer>
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
            <Link
              css={{ width: 'fit-content', display: 'inline' }}
              to={'welcome'}
            >
              здесь
            </Link>
          </>
        }
        headerGradient="rgb(255, 28, 247) 25%, rgb(178, 73, 248) 100%"
      />
    </CardsContainer>
  );
};

interface FeatureItemProps {
  stepNumber: number;
  content: JSX.Element;
}

const Count = styled('div', {
  fontSize: '$4xl',
  width: '4rem',
  height: '4rem',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '$gradient',
});
const Content = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexGrow: '1',
});
const FeatureItem = (props: FeatureItemProps) => {
  return (
    <Row css={{ alignItems: 'center', gap: '$7', jc: 'center' }}>
      <Count>{props.stepNumber}</Count>
      <Text h3>Что посмотреть?</Text>
    </Row>
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

      <FeaturesContainer>
        <Text h2 css={{ textAlign: 'center', mb: '$13', fontSize: '$4xl' }}>
          Возможности
        </Text>
      </FeaturesContainer>
    </>
  );
};

export default memo(MainPage);
