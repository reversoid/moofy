import { Input, Text, Button } from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import React from 'react';
import AuthContainer from '@/features/auth/components/AuthContainer';
import Form from '@/features/auth/components/Form';
import Heading from '@/features/auth/components/Heading';
import SubmitContainer from '@/features/auth/components/SubmitContainer';
import { authService } from '@/features/auth/services/auth.service';
import { useDefaultScrollbarGutter } from '@/styles/useDefaultScrollbarGutter';

interface FormData {
  emailOrUsername: string;
  password: string;
}

function Index() {
  useDefaultScrollbarGutter();

  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { emailOrUsername: email, password } = data;

    try {
      await authService.login({
        email,
        password,
      });
    } catch {
      /* empty */
    }
  };

  return (
    <AuthContainer xs>
      <Heading h1>Вход</Heading>
      <Form id="login-form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email или имя пользователя"
          placeholder="example@site.org"
          fullWidth
          size="xl"
          {...register('emailOrUsername')}
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
        <Button
          type="submit"
          form="login-form"
          css={{ width: 'max-content' }}
          size="lg"
        >
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
