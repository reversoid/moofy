import { Input, Text, Button, Loading } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useEvent, useStore } from 'effector-react';
import Heading from '@/features/auth/components/Heading';
import SubmitContainer from '@/features/auth/components/SubmitContainer';
import { useDefaultScrollbarGutter } from '@/styles/useDefaultScrollbarGutter';
import { $loginStatus, clearLoginError, login } from '@/models/auth';
import AuthContainer from '@/features/auth/components/AuthContainer';
import Form from '@/features/auth/components/Form';

interface FormData {
  emailOrUsername: string;
  password: string;
}

const Index = React.memo(() => {
  useDefaultScrollbarGutter();

  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = useEvent(login);
  const removeError = useEvent(clearLoginError);
  const { error, loading, success } = useStore($loginStatus);

  useEffect(() => removeError(), []);

  return (
    <AuthContainer xs>
      <Heading h1>Вход</Heading>
      <Form
        id="login-form"
        onSubmit={handleSubmit(({ emailOrUsername, password }) =>
          onSubmit({ email: emailOrUsername, password }),
        )}
      >
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
          css={{ '@xsMin': { width: 'max-content !important' } }}
          size="lg"
        >
          {loading ? (
            <Loading size="lg" type="points" color="white" />
          ) : (
            'Войти'
          )}
        </Button>
        <Text as="p">
          Еще нет аккаунта?{'  '}
          <Link href="/auth/register">Зарегистрироваться</Link>
        </Text>
      </SubmitContainer>
      {String(error)}
    </AuthContainer>
  );
});

export default Index;
