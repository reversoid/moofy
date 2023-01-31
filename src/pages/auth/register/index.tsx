import { Input, Container, Text, Button, styled } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';

const AuthContainer = styled(Container, {
  padding: '2rem 0 !important',
});

const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  mb: '2.5rem',
});

const SubmitContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '0.75rem',
});

function Index() {
  return (
    <AuthContainer xs>
      <Text h1 css={{ pb: '1.5rem', margin: 0 }}>
        Регистрация
      </Text>
      <Form>
        <Input
          label="Email"
          placeholder="example@site.org"
          fullWidth
          size="xl"
        />
        <Input
          label="Имя пользователя"
          placeholder="reversoid123"
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
        <Button css={{ width: 'max-content' }} size="lg">
          Зарегистрироваться
        </Button>
        <Text as="p">
          Уже есть аккаунт?{'  '}
          <Link href="/auth/login">Войти</Link>
        </Text>
      </SubmitContainer>
    </AuthContainer>
  );
}

export default Index;
