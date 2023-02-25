import { Button, Text, styled } from '@nextui-org/react';
import { memo } from 'react';
import waves from './img/waves.svg';
import { useNavigate } from 'react-router-dom';

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
  '@lgMax': {
    pb: '23rem',
  },
  '@xsMax': {
    pt: '$15',
    paddingBottom: '22rem',
  },
});

const FeaturesContainer = styled('div', {
  background: '#c62368',
  paddingBottom: '10rem',
  mt: '-2px',
});

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <WelcomeContainer>
        <Text
          h1
          css={{
            textGradient: '45deg, $yellow600 -20%, $red600 100%',
            fontSize: '$6xl',
            ta: 'center',
            '@lgMax': {
              fontSize: '$5xl !important',
            },
            '@xsMax': {
              fontSize: '2.5rem !important',
              lineHeight: '120%',
              mb: '$10',
            },
            '@media(max-width: 400px)': {
              fontSize: 'calc(5vw + 1.05rem) !important',
            },
          }}
        >
          Создавай коллекции фильмов
        </Text>
        <Text
          h2
          css={{
            textGradient: '45deg, $blue600 -20%, $pink600 50%',
            fontWeight: '700',
            fontSize: '$5xl',
            '@lgMax': {
              fontSize: '$4xl !important',
            },
            '@xsMax': {
              fontSize: '2rem !important',
              lineHeight: '120%',
            },
            '@media(max-width: 400px)': {
              fontSize: 'calc(5vw + 0.55rem) !important',
            },
            ta: 'center',
          }}
        >
          и делись ими с друзьями
        </Text>
        <Button
          size={'lg'}
          color={'gradient'}
          css={{
            width: 'fit-content',
            mt: '$10',
            '@xsMax': {
              mt: '$13',
            },
          }}
          onPress={() => navigate('/auth')}
        >
          Присоединиться
        </Button>
      </WelcomeContainer>

      <FeaturesContainer></FeaturesContainer>
    </>
  );
};

export default memo(MainPage);
