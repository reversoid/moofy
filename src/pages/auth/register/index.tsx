import { useForm } from 'react-hook-form';
import { Input, Text, Button, Loading } from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import Link from 'next/link';
import React from 'react';
import AuthContainer from '@/features/auth/components/AuthContainer';
import Form from '@/features/auth/components/Form';
import Heading from '@/features/auth/components/Heading';
import SubmitContainer from '@/features/auth/components/SubmitContainer';
import { useDefaultScrollbarGutter } from '@/styles/useDefaultScrollbarGutter';
import { registerFx, register as registerEvent } from '@/models/auth';

interface FormData {
  email: string;
  username: string;
  password: string;
}

function Index() {
  useDefaultScrollbarGutter();
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = useEvent(registerEvent);
  const loading = useStore(registerFx.pending);

  return (
    <AuthContainer xs>
      <Heading h1>Регистрация</Heading>
      <Form id="register-form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Имя пользователя"
          placeholder="username123"
          fullWidth
          size="xl"
          {...register('username')}
        />
        <Input
          label="Email"
          placeholder="example@site.org"
          fullWidth
          size="xl"
          {...register('email')}
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
          form="register-form"
          css={{ '@xsMin': { width: 'max-content !important' } }}
          size="lg"
        >
          {loading ? (
            <Loading size="lg" type="points" color="white" />
          ) : (
            'Зарегистрироваться'
          )}
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
