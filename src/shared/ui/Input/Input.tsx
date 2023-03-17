import { Input as _Input, styled } from '@nextui-org/react';

export const Input = styled(_Input, {
  '& input': { paddingLeft: '0.3rem' },
});

export const InputPassword = styled(_Input.Password, {
  '& input': { paddingLeft: '0.3rem' },
});
