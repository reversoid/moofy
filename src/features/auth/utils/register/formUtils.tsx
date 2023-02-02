import { RegisterOptions } from 'react-hook-form';
import { SAFE_STRING, EMAIL_PATTERN } from '@/features/auth/utils/patterns';
import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH } from '../constants';

export interface RegisterFormData {
  email: string;
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

export const EMAIL_VALIDATORS: RegisterOptions<RegisterFormData, 'email'> = {
  required: {
    value: true,
    message: 'Данное поле не должно быть пустым',
  },

  pattern: {
    value: EMAIL_PATTERN,
    message: 'Неверный формат email',
  },
  maxLength: {
    value: MAX_EMAIL_LENGTH,
    message: 'Email слишком длинный',
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
