import { useAuth } from '@/shared/hooks/useAuth';
import { Text, styled, Link as NextUiLink } from '@nextui-org/react';
import React from 'react';
import { Link } from 'react-router-dom';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$10rem',
});

const ErrorPage = ({ code = 404 }: { code?: number }) => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Container>
        <Text
          h1
          size={60}
          css={{
            textGradient: '45deg, $blue600 -20%, $pink600 50%',
            fontSize: '20rem',
            textAlign: 'center',
            '@xsMax': {
              fontSize: '10rem',
            },
          }}
          weight="bold"
        >
          {code}
        </Text>
        <Link to={isLoggedIn ? '/welcome' : '/'}>
          <Text
            b
            css={{
              textAlign: 'center',
              fontSize: '2rem',
              width: '100%',
              display: 'block',
              textGradient: '45deg, $blue600 -20%, $pink600 50%',
              '@xsMax': {
                fontSize: '1.5rem',
              },
            }}
          >
            Вернуться на главную
          </Text>
        </Link>
      </Container>
    </>
  );
};

export default ErrorPage;
