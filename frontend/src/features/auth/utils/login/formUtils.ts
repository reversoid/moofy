import { RegisterOptions } from 'react-hook-form';
import { SAFE_STRING } from '@/features/auth/utils/patterns';
import { MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH } from '../constants';

export interface LoginFormData {
  username: string;
  password: string;
}

export const USERNAME_OR_EMAIL_VALIDATORS: RegisterOptions<
  LoginFormData,
  'username'
> = {
  required: {
    value: true,
    message: 'Данное поле не должно быть пустым',
  },
  pattern: {
    value: SAFE_STRING,
    message:
      "Неверный формат email, либо используются не латинские буквы, цифры, '_' и '-'",
  },
  validate: (username) => {
    if (SAFE_STRING.test(username) && username.length > MAX_USERNAME_LENGTH) {
      return 'Имя пользователя очень длинное';
    }
  },
};

export const PASSWORD_VALIDATORS: RegisterOptions<LoginFormData, 'password'> = {
  required: {
    value: true,
    message: 'Данное поле не должно быть пустым',
  },
  maxLength: {
    value: MAX_PASSWORD_LENGTH,
    message: 'Слишком длинный пароль',
  },
};
