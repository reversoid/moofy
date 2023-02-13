import { Form as _Form } from '@/shared/ui/Form';
import { styled } from '@nextui-org/react';

export const Form = styled(_Form, {
  gap: '$9',
  mb: '$14',
});

export const SubmitContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '$8',
});
