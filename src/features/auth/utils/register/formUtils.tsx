import { RegisterOptions } from 'react-hook-form';
import { SAFE_STRING } from '@/features/auth/utils/patterns';
import { MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH } from '../constants';

export interface RegisterFormData {
  username: string;
  password: string;
}

export const USERNAME_VALIDATORS: RegisterOptions<
  RegisterFormData,
  'username'
> = {
  required: {
    value: true,
    message: 'Данное поле не должно быть пустым',
  },
  pattern: {
    value: SAFE_STRING,
    message: "Разрешено использовать латинские буквы, цифры, '_' и '-'",
  },
  maxLength: {
    value: MAX_USERNAME_LENGTH,
    message: 'Имя пользователя очень длинное',
  },
};

export const PASSWORD_VALIDATORS: RegisterOptions<
  RegisterFormData,
  'password'
> = {
  required: {
    value: true,
    message: 'Данное поле не должно быть пустым',
  },
  pattern: {
    value: /^\S*$/,
    message: 'Нельзя использовать пробелы',
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
