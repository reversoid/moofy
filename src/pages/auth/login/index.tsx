import { Input, Text, Button } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import AuthContainer from '@/features/auth/components/AuthContainer';
import Form from '@/features/auth/components/Form';
import Heading from '@/features/auth/components/Heading';
import SubmitContainer from '@/features/auth/components/SubmitContainer';
import { authService } from '@/features/auth/services/auth.service';

function Index() {
  const handleLoginClick = async () => {
    await authService.login({
      email: 'gosh2a@mail.ru',
      password: '123',
    });
    console.log('success');
  };
  return (
    <AuthContainer xs>
      <Heading h1>Вход</Heading>
      <Form>
        <Input
          label="Email или имя пользователя"
          placeholder="example@site.org"
          fullWidth
          size="xl"
        />
        <Input.Password
          label="Пароль"
          placeholder="Пароль"
          fullWidth
          size="xl"
        />
      </Form>
      <SubmitContainer>
        <Button css={{ width: 'max-content' }} size="lg" onClick={handleLoginClick}>
          Войти
        </Button>
        <Text as="p">
          Еще нет аккаунта?{'  '}
          <Link href="/auth/register">Зарегистрироваться</Link>
        </Text>
      </SubmitContainer>
    </AuthContainer>
  );
}

export default Index;
