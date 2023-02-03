import { Text, Button, Loading } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import React, { memo, useMemo } from 'react';
import { useEvent, useStore } from 'effector-react';
import { useRouter } from 'next/router';
import Heading from '@/features/auth/components/Title';
import { useDefaultScrollbarGutter } from '@/styles/useDefaultScrollbarGutter';
import AuthContainer from '@/features/auth/components/AuthContainer';
import { Form, SubmitContainer } from '@/features/auth/components/Form';
import {
  StyledInput,
  StyledPassword,
} from '@/features/auth/components/StyledInputs';
import {
  LoginFormData,
  PASSWORD_VALIDATORS,
  USERNAME_OR_EMAIL_VALIDATORS,
} from '@/features/auth/utils/login/formUtils';
import InfoIconWithTooltip from '@/features/auth/components/InfoIconWithTooltip';
import { login, $loginStatus, loginFx } from '@/models/auth/login';
import { useAuth } from '@/contexts/Auth';

const Index = () => {
  useDefaultScrollbarGutter();
  const router = useRouter();

  const { isLoggedIn, isLoading } = useAuth();

  if (isLoggedIn) {
    router.push('/');
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid: isFormValid },
  } = useForm<LoginFormData>({ mode: 'onChange' });

  const onSubmit = useEvent(login);
  const { error, loading } = useStore($loginStatus);

  useMemo(
    () =>
      loginFx.doneData.watch(() => {
        router.push('/');
      }),
    [],
  );

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <AuthContainer xs>
        <Heading h1>Вход</Heading>
        <Form
          id="login-form"
          onSubmit={handleSubmit(({ emailOrUsername, password }) =>
            onSubmit({ email: emailOrUsername, password }),
          )}
        >
          <StyledInput
            label="Email или имя пользователя"
            placeholder="example@site.org"
            fullWidth
            size="xl"
            {...register('emailOrUsername', USERNAME_OR_EMAIL_VALIDATORS)}
            status={errors.emailOrUsername && 'error'}
            contentRight={
              errors.emailOrUsername?.message && (
                <InfoIconWithTooltip
                  message={errors.emailOrUsername?.message}
                />
              )
            }
          />
          <StyledPassword
            label="Пароль"
            placeholder="Пароль"
            fullWidth
            size="xl"
            {...register('password', PASSWORD_VALIDATORS)}
            status={errors.password && 'error'}
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
            form="login-form"
            css={{ '@xsMin': { width: 'max-content !important' } }}
            size="lg"
            disabled={!isFormValid}
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
      </AuthContainer>
    );
  }

  return null;
};

export default memo(Index);
