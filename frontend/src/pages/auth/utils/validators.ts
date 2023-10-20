import { MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH } from './constants';
import { NO_WHITESPACES, USERNAME_PATTERN } from './patterns';
import { RegisterOptions, ValidationRule } from 'react-hook-form';
import { LoginFormData } from '../login/ui/LoginForm';
import { RegisterFormData } from '../register/ui/RegisterForm';
import { checkUsernameDebounced } from './checkUsername';

const REQUIRED_RULE: ValidationRule<boolean> = {
  value: true,
  message: 'Данное поле не должно быть пустым',
};

const USERNAME_PATTERN_RULE: ValidationRule<RegExp> = {
  value: USERNAME_PATTERN,
  message: `Разрешено использовать латинские буквы, цифры, '.' '_' и '-'`,
};

const USERNAME_MAX_LENGTH_RULE: ValidationRule<number> = {
  value: MAX_USERNAME_LENGTH,
  message: 'Имя пользователя слишком длинное',
};

const PASSWORD_MAX_LENGTH_RULE: ValidationRule<number> = {
  value: MAX_PASSWORD_LENGTH,
  message: 'Максимальная длина пароля: 512 символов',
};

const PASSWORD_MIN_LENGTH_RULE: ValidationRule<number> = {
  value: 8,
  message: 'Минимальная длина пароля: 8 символов',
};

const PASSWORD_PATTERN_RULE: ValidationRule<RegExp> = {
  value: NO_WHITESPACES,
  message: 'Нельзя использовать пробелы',
};

export const usernameRegisterOptions: RegisterOptions<
  RegisterFormData,
  'username'
> = {
  required: REQUIRED_RULE,
  pattern: USERNAME_PATTERN_RULE,
  maxLength: USERNAME_MAX_LENGTH_RULE,
  validate: checkUsernameDebounced
};

export const usernameLoginOptions: RegisterOptions<LoginFormData, 'username'> =
  {
    required: REQUIRED_RULE,
    pattern: USERNAME_PATTERN_RULE,
  };

export const passwordLoginOptions: RegisterOptions<LoginFormData, 'password'> =
  {
    maxLength: PASSWORD_MAX_LENGTH_RULE,
    required: REQUIRED_RULE,
  };

export const passwordRegisterOptions: RegisterOptions<
  RegisterFormData,
  'username'
> = {
  maxLength: PASSWORD_MAX_LENGTH_RULE,
  minLength: PASSWORD_MIN_LENGTH_RULE,
  required: REQUIRED_RULE,
  pattern: PASSWORD_PATTERN_RULE,
};
