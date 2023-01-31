import { SubmitHandler, useForm } from 'react-hook-form';
import { Input, Text, Button } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react';
import AuthContainer from '@/features/auth/components/AuthContainer';
import Form from '@/features/auth/components/Form';
import Heading from '@/features/auth/components/Heading';
import SubmitContainer from '@/features/auth/components/SubmitContainer';
import { useDefaultScrollbarGutter } from '@/styles/useDefaultScrollbarGutter';
import { authService } from '@/features/auth/services/auth.service';

interface FormData {
  email: string;
  username: string;
  password: string;
}

function Index() {
  useDefaultScrollbarGutter();
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await authService.register(data);
    } catch {
      /* empty */
    }
  };
  return (
    <AuthContainer xs>
      <Heading h1>Регистрация</Heading>
      <Form id="register-form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          placeholder="example@site.org"
          fullWidth
          size="xl"
          {...register('email')}
        />
        <Input
          label="Имя пользователя"
          placeholder="reversoid123"
          fullWidth
          size="xl"
          {...register('username')}
        />
        <Input.Password
          label="Пароль"
          placeholder="Пароль"
          fullWidth
          size="xl"
          {...register('password')}
        />
      </Form>
      <SubmitContainer>
        <Button form="register-form" css={{ width: 'max-content' }} size="lg">
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
