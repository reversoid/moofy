import { Text, Button, Loading } from '@nextui-org/react';
import React, { memo, useMemo } from 'react';
import { useEvent, useStore } from 'effector-react';
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
} from '@/features/auth/utils/login/formUtils';
import InfoIconWithTooltip from '@/features/auth/components/InfoIconWithTooltip';
import { login, $loginStatus, loginFx } from '@/models/auth/login';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { USERNAME_VALIDATORS } from '@/features/auth/utils/register/formUtils';

const LoginPage = () => {
  useDefaultScrollbarGutter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid: isFormValid },
  } = useForm<LoginFormData>({ mode: 'onChange' });

  const onSubmit = useEvent(login);
  const { loading } = useStore($loginStatus);

  return (
    <AuthContainer xs>
      <Heading h1>Вход</Heading>
      <Form id="login-form" onSubmit={handleSubmit(onSubmit)}>
        <StyledInput
          label="Email или имя пользователя"
          placeholder="example@site.org"
          fullWidth
          size="xl"
          {...register('username', USERNAME_VALIDATORS)}
          status={errors.username && 'error'}
          contentRight={
            errors.username?.message && (
              <InfoIconWithTooltip message={errors.username?.message} />
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
          color={'gradient'}
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
          <Link to="/auth/register">Зарегистрироваться</Link>
        </Text>
      </SubmitContainer>
    </AuthContainer>
  );
};

export default memo(LoginPage);
