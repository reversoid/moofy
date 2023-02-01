import { useForm } from 'react-hook-form';
import { Text, Button, Loading } from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import Link from 'next/link';
import React from 'react';
import AuthContainer from '@/features/auth/components/AuthContainer';
import Heading from '@/features/auth/components/Title';
import { useDefaultScrollbarGutter } from '@/styles/useDefaultScrollbarGutter';
import { registerFx, register as registerEvent } from '@/models/auth';
import { Form, SubmitContainer } from '@/features/auth/components/Form';
import {
  StyledInput,
  StyledPassword,
} from '@/features/auth/components/StyledInputs';
import {
  EMAIL_VALIDATORS,
  FormData,
  PASSWORD_VALIDATORS,
  USERNAME_VALIDATORS,
} from '@/features/auth/utils/register/formUtils';
import InfoIconWithTooltip from '@/features/auth/components/InfoIconWithTooltip';

function Index() {
  useDefaultScrollbarGutter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid: isFormValid },
  } = useForm<FormData>({ mode: 'onChange' });

  const loading = useStore(registerFx.pending);
  const onSubmit = useEvent(registerEvent);

  return (
    <AuthContainer xs>
      <Heading h1>Регистрация</Heading>
      <Form id="register-form" onSubmit={handleSubmit(onSubmit)}>
        <StyledInput
          label="Имя пользователя"
          placeholder="username123"
          fullWidth
          size="xl"
          status={errors.username && 'error'}
          contentRight={
            errors.username?.message && (
              <InfoIconWithTooltip message={errors.username?.message} />
            )
          }
          {...register('username', USERNAME_VALIDATORS)}
        />
        <StyledInput
          autoComplete="true"
          type="email"
          label="Email"
          placeholder="example@site.org"
          fullWidth
          size="xl"
          status={errors.email && 'error'}
          {...register('email', EMAIL_VALIDATORS)}
          contentRight={
            errors.email?.message && (
              <InfoIconWithTooltip message={errors.email?.message} />
            )
          }
        />
        <StyledPassword
          label="Пароль"
          placeholder="Пароль"
          fullWidth
          size="xl"
          status={errors.password && 'error'}
          {...register('password', PASSWORD_VALIDATORS)}
          contentRight={
            errors.password?.message && (
              <InfoIconWithTooltip message={errors.password?.message} />
            )
          }
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
