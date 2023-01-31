import { Input, Text, Button } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import AuthContainer from '@/features/auth/components/AuthContainer';
import Form from '@/features/auth/components/Form';
import Heading from '@/features/auth/components/Heading';
import SubmitContainer from '@/features/auth/components/SubmitContainer';

function Index() {
  return (
    <AuthContainer xs>
      <Heading h1>Регистрация</Heading>
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
