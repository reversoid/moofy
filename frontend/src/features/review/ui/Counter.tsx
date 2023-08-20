import down from '@/shared/assets/img/down.svg';
import up from '@/shared/assets/img/up.svg';
import { getColorsByScore } from '@/shared/lib/scoreColors';
import { Button, styled } from '@nextui-org/react';
import { memo, useState } from 'react';

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
  score: any;
  setValue: (newValue: number) => void;
  getValue: () => number;
  disabled?: boolean;
}

const Counter = ({ score, setValue, getValue, disabled }: CounterProps) => {
  const increase = () => {
    const currentValue = getValue();
    if (currentValue >= 10) {
      return;
    }
    setValue(currentValue + 1);
    changeColor();
  };

  const decrease = () => {
    const currentValue = getValue() || 1;
    if (currentValue <= 1) {
      return;
    }
    setValue(currentValue - 1);
    changeColor();
  };

  const [color, setColor] = useState(getColorsByScore(getValue()));

  const changeColor = () => {
    setColor(getColorsByScore(getValue()));
  };

  return (
    <CounterContainer>
      <IconButton onPress={decrease} disabled={disabled}>
        <Icon src={down} alt="Down arrow" />
      </IconButton>

      <InputStyled
        readOnly
        type="number"
        value={score}
        style={{
          background: color?.main,
          color: color?.contrast,
        }}
        disabled={disabled}
      />

      <IconButton onPress={increase} disabled={disabled}>
        <Icon src={up} alt="Up arrow" />
      </IconButton>
    </CounterContainer>
  );
};

export default memo(Counter);


