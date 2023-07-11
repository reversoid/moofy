import { useAuth } from '@/shared/hooks/useAuth';
import { Text, styled, Link as NextUiLink } from '@nextui-org/react';
import React from 'react';
import { Link } from 'react-router-dom';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  ai: 'center',
  jc: 'center',
  gap: '$10rem',
});

const ErrorPage = ({ code = 404 }: { code?: number }) => {
  const { isLoggedIn } = useAuth();

  return (
    <Container>
      <Text
        b
        css={{
          textAlign: 'center',
          fontSize: '2rem',
          width: '100%',
          display: 'block',
          textGradient: '45deg, $blue600 -20%, $pink600 50%',
          fontWeight: 'bold',
        }}
      >
        Что-то пошло не так...
      </Text>
      <Text
        b
        css={{
          textAlign: 'center',
          fontSize: '1.25rem',
          width: '100%',
          display: 'block',
          color: '$neutral',
          fontWeight: 'bold',
        }}
      >
        Если ошибка повторяется, то свяжитесь, пожалуйста, с{' '}
        <Link to={'/support'}>поддержкой</Link>
      </Text>
      <Link to={isLoggedIn ? '/welcome' : '/'}>
        <Text
          css={{
            textAlign: 'center',
            fontSize: '1.25rem',
            width: '100%',
            display: 'block',
            fontWeight: 'bold',
            color: '$link',
          }}
        >
          На главную
        </Text>
      </Link>
    </Container>
  );
};

export default ErrorPage;
