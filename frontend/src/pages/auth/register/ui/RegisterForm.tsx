import { composeValidators } from '@/shared/lib/forms/composeValidators';
import { Input, InputPassword } from '@/shared/ui/Input/Input';
import { Loading } from '@nextui-org/react';
import { Field, Form as FinalForm } from 'react-final-form';
import { Form } from '../../ui/Form';
import { SubmitContainer } from '../../ui/SubmitContainer';
import {
  passwordMinLength,
  passwordPattern,
  registerFieldRequired,
  usernameMaxLength,
  usernamePattern,
} from '../../utils/validators';
import InfoIconWithTooltip from '../../ui/InfoIconWithTooltip';
import { checkUsernameDebounced } from '../../utils/checkUsername';
import { useRegister } from '@/features/auth';

export interface RegisterFormData {
  username: string;
  password: string;
}

export const RegisterForm = () => {
  const mutation = useRegister()
  return (
    <FinalForm<RegisterFormData>
      onSubmit={async (form) => {
        await mutation.mutateAsync(form)
      }}
      render={({ handleSubmit, submitting, validating, invalid }) => (
        <>
          <Form id="register-form" onSubmit={handleSubmit}>
            <Field
              name="username"
              validate={composeValidators(
                registerFieldRequired,
                usernameMaxLength,
                usernamePattern,
                checkUsernameDebounced,
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
                    meta.validating ? (
                      <Loading size="sm" />
                    ) : meta.modified && meta.error ? (
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
                passwordPattern,
                passwordMinLength,
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
            buttonText="Зарегистрироваться"
            formId="register-form"
          />
        </>
      )}
    />
  );
};
