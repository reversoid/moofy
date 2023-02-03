import { Text, Button, Loading } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useEvent, useStore } from 'effector-react';
import Heading from '@/features/auth/components/Title';
import { useDefaultScrollbarGutter } from '@/styles/useDefaultScrollbarGutter';
import { $loginStatus, clearLoginError, login } from '@/models/auth';
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

const Index = React.memo(() => {
  useDefaultScrollbarGutter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid: isFormValid },
  } = useForm<LoginFormData>({ mode: 'onChange' });

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
        <StyledInput
          label="Email или имя пользователя"
          placeholder="example@site.org"
          fullWidth
          size="xl"
          {...register('emailOrUsername', USERNAME_OR_EMAIL_VALIDATORS)}
          status={errors.emailOrUsername && 'error'}
          contentRight={
            errors.emailOrUsername?.message && (
              <InfoIconWithTooltip message={errors.emailOrUsername?.message} />
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
});

export default Index;
