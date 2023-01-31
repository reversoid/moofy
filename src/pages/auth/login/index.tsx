import { Input, Text, Button } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import {
  AuthContainer,
  Form,
  Heading,
  SubmitContainer,
} from '../CommonAuthComponents';

function Index() {
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
        <Button css={{ width: 'max-content' }} size="lg">
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
