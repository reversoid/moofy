import { RegisterOptions } from 'react-hook-form';
import { SAFE_STRING, EMAIL_PATTERN } from '@/features/auth/utils/patterns';

export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
}

export const USERNAME_VALIDATORS: RegisterOptions<RegisterFormData, 'username'> = {
  required: {
    value: true,
    message: 'Данное поле не должно быть пустым',
  },
  pattern: {
    value: SAFE_STRING,
    message: "Разрешено использовать латинские буквы, цифры, '_' и '-'",
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
};

export const PASSWORD_VALIDATORS: RegisterOptions<RegisterFormData, 'password'> = {
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
};
