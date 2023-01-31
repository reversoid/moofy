import { Input, Text, Button } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import React from 'react';
import AuthContainer from '@/features/auth/components/AuthContainer';
import Form from '@/features/auth/components/Form';
import Heading from '@/features/auth/components/Heading';
import SubmitContainer from '@/features/auth/components/SubmitContainer';
import { authService } from '@/features/auth/services/auth.service';
import { AxiosError } from 'axios';
import { ApiError } from 'next/dist/server/api-utils';

interface FormData {
  emailOrUsername: string;
  password: string;
}

function Index() {
  const { register, getValues } = useForm<FormData>();

  const handleSubmit = async () => {
    const data = getValues();

    try {
      await authService.login({
        email: data.emailOrUsername,
        password: data.password,
      });
    } catch { /* empty */ }
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
        <Button css={{ width: 'max-content' }} size="lg" onPress={handleSubmit}>
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
