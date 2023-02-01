import React from 'react';
import { Tooltip, Button } from '@nextui-org/react';
import { RegisterOptions } from 'react-hook-form';
import Image from 'next/image';
import { SAFE_STRING, EMAIL_PATTERN } from '@/features/auth/utils/patterns';

export interface FormData {
  email: string;
  username: string;
  password: string;
}

export const InfoIconWithTooltip = ({ message }: { message: string }) => {
  return (
    <Tooltip color="invert" content={message} placement="leftStart">
      <Button light css={{ p: 0, m: 0, width: 20, height: 20, minWidth: 0 }}>
        <Image src="/img/info.svg" alt="Info icon" width={20} height={20} />
      </Button>
    </Tooltip>
  );
};

export const USERNAME_VALIDATORS: RegisterOptions<FormData, 'username'> = {
  required: {
    value: true,
    message: 'Данное поле не должно быть пустым',
  },
  pattern: {
    value: SAFE_STRING,
    message: "Разрешено использовать латинские буквы, цифры, '_' и '-'",
  },
};

export const EMAIL_VALIDATORS: RegisterOptions<FormData, 'email'> = {
  required: {
    value: true,
    message: 'Данное поле не должно быть пустым',
  },

  pattern: {
    value: EMAIL_PATTERN,
    message: 'Неверный формат email',
  },
};

export const PASSWORD_VALIDATORS: RegisterOptions<FormData, 'password'> = {
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
