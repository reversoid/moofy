import { Input, InputPassword } from '@/shared/ui/Input/Input';
import { Form } from '../../ui/Form';
import { SubmitContainer } from '../../ui/SubmitContainer';
import InfoIconWithTooltip from '../../ui/InfoIconWithTooltip';
import { useLogin } from '@/features/auth';
import { useForm } from 'react-hook-form';
import { passwordLoginOptions, usernameLoginOptions } from '../../utils/validators';

export interface LoginFormData {
  username: string;
  password: string;
}


export const LoginForm = () => {
  const mutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid: isFormValid },
  } = useForm<LoginFormData>({ mode: 'onChange' });

  return (
    <>
      <Form id="login-form" onSubmit={handleSubmit((e) => mutation.mutate(e))}>
        <Input
          {...register('username', usernameLoginOptions)}
          label="Имя пользователя"
          placeholder="username123"
          fullWidth
          size="xl"
          status={errors['username']?.message ? 'error' : 'default'}
          contentRight={
            errors['username']?.message ? (
              <InfoIconWithTooltip message={errors['username']?.message} />
            ) : undefined
          }
        />

        <InputPassword
          {...register('password', passwordLoginOptions)}
          label="Пароль"
          placeholder="Пароль"
          fullWidth
          size="xl"
          status={errors['password'] ? 'error' : 'default'}
          contentRight={
            errors['password']?.message && (
              <InfoIconWithTooltip message={errors['password']?.message} />
            )
          }
        />
      </Form>

      <SubmitContainer
        buttonDisabled={!isFormValid}
        buttonSilentlyDisabled={mutation.isLoading}
        buttonLoading={mutation.isLoading}
        buttonText="Войти"
        formId="login-form"
      />
    </>
  );
};
