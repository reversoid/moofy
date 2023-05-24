import { useForm } from 'react-hook-form';
import { Text, Loading } from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import { memo, useCallback, useEffect } from 'react';
import AuthContainer from '@/features/auth/components/AuthContainer';
import Heading from '@/features/auth/components/Title';
import { useDefaultScrollbarGutter } from '@/app/styles/useDefaultScrollbarGutter';
import {
  RegisterFormData,
  PASSWORD_VALIDATORS,
  USERNAME_VALIDATORS,
} from '@/features/auth/utils/register/formUtils';
import { Link, useLocation } from 'react-router-dom';
import { useFieldsChecks } from '../lib/useFieldsChecks';
import { Input, InputPassword } from '@/shared/ui/Input/Input';
import InfoIconWithTooltip from '@/features/auth/components/InfoIconWithTooltip/InfoIconWithTooltip';
import {
  register as registerEvent,
  $registerStatus,
  $checkUsernameResult,
} from '@/features/auth';
import { SubmitContainer } from '../../_ui/SubmitContainer';
import { Form } from '../../_ui/Form';

const RegisterPage = () => {
  useDefaultScrollbarGutter();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    trigger,
    getFieldState,
    formState: { errors, isValid: isFormValid },
  } = useForm<RegisterFormData>({ mode: 'onChange' });

  const {
    loadingEmailCheck,
    loadingUsernameCheck,
    onChangeUsernameDebounced,
    usernameExists,
  } = useFieldsChecks();

  let submitButtonDisabled =
    !isFormValid ||
    loadingEmailCheck ||
    loadingUsernameCheck ||
    Boolean(Object.keys(errors).length);

  const onSubmit = useEvent(registerEvent);

  const { loading } = useStore($registerStatus);

  useEffect(() => {
    if (usernameExists === null) {
      return;
    }

    if (usernameExists) {
      setError('username', { message: 'Имя пользователя уже занято' });
    } else {
      clearErrors('username');
      trigger('username');
    }
  }, [usernameExists]);

  const checkUsername = useCallback(
    (event: any) =>
      setTimeout(() => {
        const { invalid } = getFieldState('username');
        if (!invalid) {
          onChangeUsernameDebounced({ username: event.target.value });
        }
      }),
    [],
  );

  const { search } = useLocation();

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
          contentRight={
            loadingUsernameCheck ? (
              <Loading size="sm" />
            ) : (
              errors.username?.message && (
                <InfoIconWithTooltip message={errors.username?.message} />
              )
            )
          }
          {...register('username', {
            ...USERNAME_VALIDATORS,
            onChange(e) {
              submitButtonDisabled = true;
              checkUsername(e);
            },
          })}
        />
        <InputPassword
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

      <SubmitContainer
        additionalElement={
          <Text as="p">
            Уже есть аккаунт?{'  '}
            <Link to={`/auth/login${search}`}>Войти</Link>
          </Text>
        }
        buttonDisabled={submitButtonDisabled}
        buttonLoading={loading}
        buttonText="Зарегистрироваться"
        formId="register-form"
      />
    </AuthContainer>
  );
};

export default RegisterPage;
