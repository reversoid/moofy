import { composeValidators } from '@/shared/utils/forms/composeValidators';
import { Input, InputPassword } from '@/shared/ui/Input/Input';
import { Field, Form as FinalForm } from 'react-final-form';
import { Form } from '../../ui/Form';
import { SubmitContainer } from '../../ui/SubmitContainer';
import {
  passwordMaxLength,
  registerFieldRequired,
  usernameMaxLength,
  usernamePattern,
} from '../../utils/validators';
import InfoIconWithTooltip from '../../ui/InfoIconWithTooltip';
import { useMutation } from '@tanstack/react-query';
import { useLogin } from '@/features/auth';

export interface LoginFormData {
  username: string;
  password: string;
}

export const LoginForm = () => {
  const mutation = useLogin();

  return (
    <FinalForm<LoginFormData>
      onSubmit={async (form) => {
        await mutation.mutateAsync(form);
      }}
      render={({ handleSubmit, submitting, validating, invalid }) => (
        <>
          <Form id="login-form" onSubmit={handleSubmit}>
            <Field
              name="username"
              validate={composeValidators(
                registerFieldRequired,
                usernameMaxLength,
                usernamePattern,
              )}
              validateFields={[]}
            >
              {({ input, meta }) => (
                <Input
                  {...input}
                  label="Имя пользователя"
                  placeholder="username123"
                  fullWidth
                  size="xl"
                  status={meta.modified && meta.error ? 'error' : 'default'}
                  contentRight={
                    meta.modified && meta.error ? (
                      <InfoIconWithTooltip message={meta.error} />
                    ) : undefined
                  }
                />
              )}
            </Field>

            <Field
              name="password"
              validate={composeValidators(
                registerFieldRequired,
                passwordMaxLength,
              )}
              validateFields={[]}
            >
              {({ input, meta }) => (
                <InputPassword
                  {...input}
                  label="Пароль"
                  placeholder="Пароль"
                  fullWidth
                  size="xl"
                  status={meta.modified && meta.error ? 'error' : 'default'}
                  contentRight={
                    meta.modified &&
                    meta.error && <InfoIconWithTooltip message={meta.error} />
                  }
                />
              )}
            </Field>
          </Form>

          <SubmitContainer
            buttonDisabled={invalid}
            buttonSilentlyDisabled={validating}
            buttonLoading={submitting}
            buttonText="Войти"
            formId="login-form"
          />
        </>
      )}
    />
  );
};
