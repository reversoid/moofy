import { useForm } from 'react-hook-form';
import { Input, Text, Button, Loading, Tooltip } from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import AuthContainer from '@/features/auth/components/AuthContainer';
import Heading from '@/features/auth/components/Heading';
import SubmitContainer from '@/features/auth/components/SubmitContainer';
import { useDefaultScrollbarGutter } from '@/styles/useDefaultScrollbarGutter';
import { registerFx, register as registerEvent } from '@/models/auth';
import Form from '@/features/auth/components/Form';
import { EMAIL_PATTERN, SAFE_STRING } from '@/features/auth/utils/patterns';

interface FormData {
  email: string;
  username: string;
  password: string;
}

function Index() {
  useDefaultScrollbarGutter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid: isFormValid },
  } = useForm<FormData>({ mode: 'onChange' });

  const loading = useStore(registerFx.pending);
  const onSubmit = useEvent(registerEvent);

  return (
    <AuthContainer xs>
      <Heading h1>Регистрация</Heading>
      <Form id="register-form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Имя пользователя"
          placeholder="username123"
          fullWidth
          size="xl"
          status={errors.username && 'error'}
          css={{ '& input': { paddingLeft: '0.3rem' } }}
          contentRight={
            errors.username?.message && (
              <Tooltip
                color="invert"
                content={errors.username?.message}
                placement="leftStart"
              >
                <Button
                  light
                  css={{ p: 0, m: 0, width: 20, height: 20, minWidth: 0 }}
                >
                  <Image src="/img/info.svg" alt="Info icon" width={20} height={20} />
                </Button>
              </Tooltip>
            )
          }
          {...register('username', {
            required: true,
            pattern: {
              value: SAFE_STRING,
              message:
                'Разрешено использовать латинские буквы, цифры, "_" и "-"',
            },
          })}
        />
        <Input
          autoComplete="true"
          type="email"
          label="Email"
          placeholder="example@site.org"
          fullWidth
          size="xl"
          status={errors.email && 'error'}
          css={{ '& input': { paddingLeft: '0.3rem' } }}
          {...register('email', {
            required: true,
            pattern: {
              value: EMAIL_PATTERN,
              message: 'Неверный формат email',
            },
          })}
          contentRight={
            errors.email?.message && (
              <Tooltip
                color="invert"
                content={errors.email?.message}
                placement="leftStart"
              >
                <Button
                  light
                  css={{ p: 0, m: 0, width: 20, height: 20, minWidth: 0 }}
                >
                  <Image src="/img/info.svg" alt="Info icon" width={20} height={20} />
                </Button>
              </Tooltip>
            )
          }
        />
        <Input.Password
          label="Пароль"
          placeholder="Пароль"
          fullWidth
          size="xl"
          status={errors.password && 'error'}
          css={{ '& input': { paddingLeft: '0.3rem' } }}
          {...register('password', {
            required: true,
            pattern: {
              value: SAFE_STRING,
              message:
                'Разрешено использовать латинские буквы, цифры, "_" и "-"',
            },
            minLength: {
              value: 8,
              message: 'Минимальная длина пароля: 8 символов',
            },
          })}
          contentRight={
            errors.password?.message && (
              <Tooltip
                color="invert"
                content={errors.password.message}
                placement="leftStart"
              >
                <Button
                  light
                  css={{ p: 0, m: 0, width: 20, height: 20, minWidth: 0 }}
                >
                  <Image src="/img/info.svg" alt="Info icon" width={20} height={20} />
                </Button>
              </Tooltip>
            )
          }
        />
      </Form>
      <SubmitContainer>
        <Button
          type="submit"
          form="register-form"
          css={{ '@xsMin': { width: 'max-content !important' } }}
          size="lg"
          disabled={!isFormValid}
        >
          {loading ? (
            <Loading size="lg" type="points" color="white" />
          ) : (
            'Зарегистрироваться'
          )}
        </Button>
        <Text as="p">
          Уже есть аккаунт?{'  '}
          <Link href="/auth/login">Войти</Link>
        </Text>
      </SubmitContainer>
    </AuthContainer>
  );
}

export default Index;
