import { useForm } from 'react-hook-form';
import { Text, Button, Loading } from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import { memo, useCallback, useEffect } from 'react';
import AuthContainer from '@/features/auth/components/AuthContainer';
import Heading from '@/features/auth/components/Title';
import { useDefaultScrollbarGutter } from '@/styles/useDefaultScrollbarGutter';
import {
  register as registerEvent,
  $registerStatus,
} from '@/models/auth/register';
import { Form, SubmitContainer } from '@/features/auth/components/Form';
import {
  RegisterFormData,
  PASSWORD_VALIDATORS,
  USERNAME_VALIDATORS,
} from '@/features/auth/utils/register/formUtils';
import TooltipIcon from '@/shared/ui/TooltipIcon/InfoIconWithTooltip';
import { Link } from 'react-router-dom';
import { $checkUsernameResult } from '@/models/auth/register/checkUsername';
import { useFieldsChecks } from './useFieldsChecks';
import { Input, InputPassword } from '@/shared/ui/Input/Input';
import InfoIconWithTooltip from '@/features/auth/components/InfoIconWithTooltip/InfoIconWithTooltip';

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

  const { loadingEmailCheck, loadingUsernameCheck, onChangeUsernameDebounced } =
    useFieldsChecks();

  let submitButtonDisabled =
    !isFormValid ||
    loadingEmailCheck ||
    loadingUsernameCheck ||
    Boolean(Object.keys(errors).length);

  const onSubmit = useEvent(registerEvent);

  const { loading } = useStore($registerStatus);

  const usernameExists = useStore($checkUsernameResult);

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
      <SubmitContainer>
        <Button
          color={'gradient'}
          type="submit"
          form="register-form"
          css={{ '@xsMin': { width: 'max-content !important' } }}
          size="lg"
          disabled={submitButtonDisabled}
        >
          {loading ? (
            <Loading size="lg" type="points" color="white" />
          ) : (
            'Зарегистрироваться'
          )}
        </Button>
        <Text as="p">
          Уже есть аккаунт?{'  '}
          <Link to="/auth/login">Войти</Link>
        </Text>
      </SubmitContainer>
    </AuthContainer>
  );
};

export default memo(RegisterPage);
