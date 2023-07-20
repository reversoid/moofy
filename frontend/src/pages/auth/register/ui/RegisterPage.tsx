import { useDefaultScrollbarGutter } from '@/app/styles/useDefaultScrollbarGutter';
import { $registerStatus, register as registerEvent } from '@/features/auth';
import AuthContainer from '@/features/auth/components/AuthContainer';
import InfoIconWithTooltip from '@/features/auth/components/InfoIconWithTooltip/InfoIconWithTooltip';
import Heading from '@/features/auth/components/Title';
import { authService } from '@/features/auth/services/auth.service';
import {
  PASSWORD_VALIDATORS,
  RegisterFormData,
  USERNAME_VALIDATORS,
} from '@/features/auth/utils/register/formUtils';
import { Input, InputPassword } from '@/shared/ui/Input/Input';
import { Loading, Text } from '@nextui-org/react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useEvent, useStore } from 'effector-react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import { Form } from '../../_ui/Form';
import { SubmitContainer } from '../../_ui/SubmitContainer';

const checkUsernameDebounced = AwesomeDebouncePromise(
  async (username: string) => {
    const exists = await authService.checkUsernameExistence(username);
    return exists ? 'Имя пользователя уже занято' : true;
  },
  250,
);

const RegisterPage = () => {
  useDefaultScrollbarGutter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid: isFormValid, isValidating },
  } = useForm<RegisterFormData>({ mode: 'onChange' });

  let submitButtonDisabled = !isFormValid || isValidating;
  Boolean(Object.keys(errors).length);

  const onSubmit = useEvent(registerEvent);

  const { loading } = useStore($registerStatus);

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
            isValidating ? (
              <Loading size="sm" />
            ) : (
              errors.username?.message && (
                <InfoIconWithTooltip message={errors.username?.message} />
              )
            )
          }
          {...register('username', {
            ...USERNAME_VALIDATORS,
            validate: {
              usernameAvailable: checkUsernameDebounced,
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
