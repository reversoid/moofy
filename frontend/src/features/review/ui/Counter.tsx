import down from '@/shared/assets/img/down.svg';
import up from '@/shared/assets/img/up.svg';
import { getColorsByScore } from '@/shared/lib/scoreColors';
import { Button, styled } from '@nextui-org/react';
import { memo, useState } from 'react';
import { FieldInputProps } from 'react-final-form';

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
  variants: {
    disabled: {
      true: {
        backgroundColor: '$neutral !important',
        cursor: 'default'
      }
    }
  }
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
  fieldInputProps: FieldInputProps<number, HTMLElement>
  disabled?: boolean;
}

const Counter = ({ fieldInputProps, disabled }: CounterProps) => {
  const increase = () => {
    const currentValue = fieldInputProps.value;
    if (currentValue >= 10) {
      return;
    }
    fieldInputProps.onChange(currentValue + 1);
    changeColor();
  };

  const decrease = () => {
    const currentValue = fieldInputProps.value;
    if (currentValue <= 1) {
      return;
    }
    fieldInputProps.onChange(currentValue - 1);
    changeColor();
  };

  const [color, setColor] = useState(getColorsByScore(fieldInputProps.value));

  const changeColor = () => {
    setColor(getColorsByScore(fieldInputProps.value));
  };

  return (
    <CounterContainer>
      <IconButton onPress={decrease} disabled={disabled}>
        <Icon src={down} alt="Down arrow" />
      </IconButton>

      <InputStyled
        readOnly
        type="number"
        value={fieldInputProps.value}
        style={{
          background: color?.main,
          color: color?.contrast,
        }}
        disabled={disabled}
        name={fieldInputProps.name}
      />

      <IconButton onPress={increase} disabled={disabled}>
        <Icon src={up} alt="Up arrow" />
      </IconButton>
    </CounterContainer>
  );
};

export default memo(Counter);


