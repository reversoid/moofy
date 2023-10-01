import { composeValidators } from '@/shared/utils/forms/composeValidators';
import { Input, InputPassword } from '@/shared/ui/Input/Input';
import { Loading } from '@nextui-org/react';
import { Form } from '../../ui/Form';
import { SubmitContainer } from '../../ui/SubmitContainer';
import InfoIconWithTooltip from '../../ui/InfoIconWithTooltip';
import { useRegister } from '@/features/auth';
import { useForm } from 'react-hook-form';
import {
  passwordRegisterOptions,
  usernameRegisterOptions,
} from '../../utils/validators';

export interface RegisterFormData {
  username: string;
  password: string;
}

export const RegisterForm = () => {
  const mutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid: isFormValid, isValidating },
  } = useForm<RegisterFormData>({ mode: 'onChange' });  

  return (
    <>
      <Form
        id="register-form"
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
      >
        <Input
          {...register('username', usernameRegisterOptions)}
          label="Имя пользователя"
          placeholder="username123"
          fullWidth
          size="xl"
          status={errors.username?.message ? 'error' : 'default'}
          contentRight={
            isValidating ? (
              <Loading size="sm" />
            ) : errors.username?.message ? (
              <InfoIconWithTooltip message={errors.username?.message} />
            ) : undefined
          }
        />

        <InputPassword
          {...register('password', passwordRegisterOptions)}
          label="Пароль"
          placeholder="Пароль"
          fullWidth
          size="xl"
          status={errors.password?.message ? 'error' : 'default'}
          contentRight={
            errors.password?.message && (
              <InfoIconWithTooltip message={errors.password?.message} />
            )
          }
        />
      </Form>

      <SubmitContainer
        buttonDisabled={!isFormValid}
        buttonSilentlyDisabled={isValidating}
        buttonLoading={mutation.isLoading}
        buttonText="Зарегистрироваться"
        formId="register-form"
      />
    </>
  );
};
