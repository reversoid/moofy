import { Container, Text, styled } from '@nextui-org/react';

export const AuthContainer = styled(Container, {
  padding: '2rem 0 !important',
});

export const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  mb: '2.5rem',
});

export const SubmitContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '0.75rem',
});

export const Heading = styled(Text, {
  pb: '1.5rem',
  margin: 0,
});
