import { useDefaultScrollbarGutter } from '@/app/styles/useDefaultScrollbarGutter';
import { Text } from '@nextui-org/react';
import { Link, useLocation } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import Heading from '../../ui/Title';
import AuthContainer from '../../ui/AuthContainer';

const LoginPage = () => {
  useDefaultScrollbarGutter();
  const { search } = useLocation();

  return (
    <AuthContainer xs>
      <Heading h1>Вход</Heading>
      <LoginForm />

      <Text css={{ mt: '$8' }} as="p">
        Еще нет аккаунта?{'  '}
        <Link to={{ pathname: '/auth/register', search }}>Войти</Link>
      </Text>
    </AuthContainer>
  );
};

export default LoginPage;
