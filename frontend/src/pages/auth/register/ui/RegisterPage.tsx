import { useDefaultScrollbarGutter } from '@/app/styles/useDefaultScrollbarGutter';
import { Text } from '@nextui-org/react';
import { Link, useLocation } from 'react-router-dom';
import { RegisterForm } from './RegisterForm';
import AuthContainer from '../../ui/AuthContainer';
import Heading from '../../ui/Title';

const RegisterPage = () => {
  useDefaultScrollbarGutter();
  const { search } = useLocation();

  return (
    <AuthContainer xs>
      <Heading h1>Регистрация</Heading>
      <RegisterForm />

      <Text css={{ mt: '$8' }} as="p">
        Уже есть аккаунт?{'  '}
        <Link to={{ pathname: '/auth/login', search }}>Войти</Link>
      </Text>
    </AuthContainer>
  );
};

export default RegisterPage;
