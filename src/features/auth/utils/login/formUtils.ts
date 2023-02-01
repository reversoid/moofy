import { RegisterOptions } from 'react-hook-form';
import { SAFE_STRING, EMAIL_OR_SAFE_STRING } from '@/features/auth/utils/patterns';

export interface LoginFormData {
  emailOrUsername: string;
  password: string;
}

export const USERNAME_OR_EMAIL_VALIDATORS: RegisterOptions<LoginFormData, 'emailOrUsername'> = {
  required: {
    value: true,
    message: 'Данное поле не должно быть пустым',
  },
  pattern: {
    value: EMAIL_OR_SAFE_STRING,
    message: "Неверный формат email, либо используются не латинские буквы, цифры, '_' и '-'",
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
};
