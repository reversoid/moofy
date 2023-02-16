import { Button, Dropdown, Input, styled } from '@nextui-org/react';
import React, { memo } from 'react';
import up from '@/assets/img/up.svg';
import down from '@/assets/img/down.svg';
import {
  FieldValues,
  UseFormRegister,
  UseFormRegisterReturn,
  useForm,
} from 'react-hook-form';

const removeArrows = {
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
  '&[type=number]': {
    '-moz-appearance': 'textfield',
  },
};

const InputStyled = styled('input', {
  fontSize: '1.75rem',
  borderRadius: '0.25rem',
  minWidth: 'auto',
  textAlign: 'center',
  border: 'none',
  width: '3rem',
  height: '3rem',
  lineHeight: '3rem',
  ...removeArrows,
});

const Icon = styled('img', {
  width: '2rem',
  height: '2rem',
  objectFit: 'contain',
});

const IconButton = styled(Button, {
  minWidth: '0 !important',
  padding: '0 !important',
  maxWidth: 'auto',
  width: '3rem !important',
  height: '3rem !important',
  background: 'transparent !important'
});

const CounterContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

interface CounterProps {
  registerReturn: UseFormRegisterReturn;
  setValue: (newValue: number) => void;
  getValue: () => number;
}

const Counter = ({ registerReturn, setValue, getValue }: CounterProps) => {
  const increase = () => {
    const currentValue = getValue();
    if (currentValue >= 10) {
      return;
    }
    setValue(currentValue + 1);
  };

  const decrease = () => {
    const currentValue = getValue();
    if (currentValue <= 1) {
      return;
    }
    setValue(currentValue - 1);
  };

  return (
    <CounterContainer>
      <IconButton onPress={decrease}>
        <Icon src={down} alt="Down arrow" />
      </IconButton>

      <InputStyled readOnly type="number" {...registerReturn} />

      <IconButton onPress={increase}>
        <Icon src={up} alt="Up arrow" />
      </IconButton>
    </CounterContainer>
  );
};

export default memo(Counter);
