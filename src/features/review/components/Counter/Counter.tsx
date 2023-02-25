import down from '@/assets/img/down.svg';
import up from '@/assets/img/up.svg';
import { Button, styled } from '@nextui-org/react';
import { memo, useEffect, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

const COLORS = [
  '#ed1b24',
  '#f36523',
  '#f8931d',
  '#ffc20d',
  '#fef200',
  '#cadb2a',
  '#8ec63f',
  '#3ab54b',
  '#00a650',
  '#008641',
];

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
  padding: 0,
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
  background: 'transparent !important',
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
    changeColor();
  };

  const decrease = () => {
    const currentValue = getValue();
    if (currentValue <= 1) {
      return;
    }
    setValue(currentValue - 1);
    changeColor();
  };

  const [color, setColor] = useState(COLORS[getValue() - 1]);

  const changeColor = () => {
    setColor(COLORS[getValue() - 1]);
  };

  return (
    <CounterContainer>
      <IconButton onPress={decrease}>
        <Icon src={down} alt="Down arrow" />
      </IconButton>

      <InputStyled
        readOnly
        type="number"
        {...registerReturn}
        style={{
          background: color,
          color: ['#ffc20d', '#fef200', '#cadb2a'].includes(color)
            ? '#2e2e2e'
            : 'white',
        }}
      />

      <IconButton onPress={increase}>
        <Icon src={up} alt="Up arrow" />
      </IconButton>
    </CounterContainer>
  );
};

export default memo(Counter);
