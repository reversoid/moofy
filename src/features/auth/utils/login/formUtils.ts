import { RegisterOptions } from 'react-hook-form';
import {
  SAFE_STRING,
  EMAIL_OR_SAFE_STRING,
  EMAIL_PATTERN,
} from '@/features/auth/utils/patterns';
import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
} from '../constants';

export interface LoginFormData {
  emailOrUsername: string;
  password: string;
}

export const USERNAME_OR_EMAIL_VALIDATORS: RegisterOptions<
  LoginFormData,
  'emailOrUsername'
> = {
  required: {
    value: true,
    message: 'Данное поле не должно быть пустым',
  },
  pattern: {
    value: EMAIL_OR_SAFE_STRING,
    message:
      "Неверный формат email, либо используются не латинские буквы, цифры, '_' и '-'",
  },
  validate: (usernameOrEmail) => {
    if (
      SAFE_STRING.test(usernameOrEmail) &&
      usernameOrEmail.length > MAX_USERNAME_LENGTH
    ) {
      return 'Имя пользователя очень длинное';
    }
    if (
      EMAIL_PATTERN.test(usernameOrEmail) &&
      usernameOrEmail.length > MAX_EMAIL_LENGTH
    ) {
      return 'Email слишком длинный';
    }
  },
};

export const PASSWORD_VALIDATORS: RegisterOptions<LoginFormData, 'password'> = {
  required: {
    value: true,
    message: 'Данное поле не должно быть пустым',
  },
  pattern: {
    value: SAFE_STRING,
    message: 'Разрешено использовать латинские буквы, цифры, "_" и "-"',
  },
  minLength: {
    value: 8,
    message: 'Минимальная длина пароля: 8 символов',
  },
  maxLength: {
    value: MAX_PASSWORD_LENGTH,
    message: 'Слишком длинный пароль',
  },
};
