import {
  maxLength,
  minLength,
  pattern,
  required,
} from '@/shared/lib/forms/validators';
import { MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH } from './constants';
import { NO_WHITESPACES, USERNAME_PATTERN } from './patterns';

export const registerFieldRequired = required(
  'Данное поле не должно быть пустым',
);

export const usernameMaxLength = maxLength(
  MAX_USERNAME_LENGTH,
  'Имя пользователя очень длинное',
);

export const usernamePattern = pattern(
  USERNAME_PATTERN,
  `Разрешено использовать латинские буквы, цифры, '.' '_' и '-'`,
);


export const passwordPattern = pattern(
  NO_WHITESPACES,
  'Нельзя использовать пробелы',
);

export const passwordMinLength = minLength(
  8,
  'Минимальная длина пароля: 8 символов',
);

export const passwordMaxLength = maxLength(
  MAX_PASSWORD_LENGTH,
  'Минимальная длина пароля: 8 символов',
);
