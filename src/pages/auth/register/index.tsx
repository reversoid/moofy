import { useForm } from 'react-hook-form';
import { Input, Text, Button, Loading } from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import Link from 'next/link';
import React from 'react';
import AuthContainer from '@/features/auth/components/AuthContainer';
import Heading from '@/features/auth/components/Heading';
import SubmitContainer from '@/features/auth/components/SubmitContainer';
import { useDefaultScrollbarGutter } from '@/styles/useDefaultScrollbarGutter';
import { registerFx, register as registerEvent } from '@/models/auth';
import Form from '@/features/auth/components/Form';
import { EMAIL_PATTERN, SAFE_STRING } from '@/features/auth/utils/patterns';

interface FormData {
  email: string;
  username: string;
  password: string;
}

function Index() {
  useDefaultScrollbarGutter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid: isFormValid },
  } = useForm<FormData>({ mode: 'onChange', reValidateMode: 'onBlur' });

  const loading = useStore(registerFx.pending);
  const onSubmit = useEvent(registerEvent);

  return (
    <AuthContainer xs>
      <Heading h1>Регистрация</Heading>
      <Form id="register-form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Имя пользователя"
          placeholder="username123"
          fullWidth
          size="xl"
          status={errors.username && 'error'}
          {...register('username', { required: true, pattern: SAFE_STRING })}
        />
        <Input
          autoComplete="true"
          type="email"
          label="Email"
          placeholder="example@site.org"
          fullWidth
          size="xl"
          status={errors.email && 'error'}
          {...register('email', { required: true, pattern: EMAIL_PATTERN })}
        />
        <Input.Password
          label="Пароль"
          placeholder="Пароль"
          fullWidth
          size="xl"
          status={errors.password && 'error'}
          {...register('password', {
            required: true,
            pattern: SAFE_STRING,
            minLength: 8,
          })}
        />
      </Form>
      <SubmitContainer>
        <Button
          type="submit"
          form="register-form"
          css={{ '@xsMin': { width: 'max-content !important' } }}
          size="lg"
          disabled={!isFormValid}
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
