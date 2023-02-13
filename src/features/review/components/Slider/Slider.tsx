import { Slider } from '@mui/material';
import { styled } from '@nextui-org/react';

/** Represents 1-10 score scale */
export const marks = [
  {
    value: 0,
    label: '1',
  },
  {
    value: 11.1111111111,
    label: '2',
  },
  {
    value: 22.222222222199996,
    label: '3',
  },
  {
    value: 33.3333333333,
    label: '4',
  },
  {
    value: 44.4444444444,
    label: '5',
  },
  {
    value: 55.55555555549999,
    label: '6',
  },
  {
    value: 66.6666666666,
    label: '7',
  },
  {
    value: 77.7777777777,
    label: '8',
  },
  {
    value: 88.8888888888,
    label: '9',
  },
  {
    value: 100,
    label: '10',
  },
];

export const StyledSlider = styled(Slider, {
  '& .MuiSlider-markLabel': {
    fontFamily: 'inherit',
    color: '$text',
    fontWeight: 'bold',
  },
  '& .MuiSlider-thumb': {
    background: '$gray900',
    boxShadow: 'none !important',
  },
  '& .MuiSlider-track': {
    background: '$gray800',
  },
  '& .MuiSlider-rail': {
    background: '$gray700',
  },
  '&#slider': {
    color: '$gray700',
  },
});

export const ariaValueText = (value: number, index: number) => {
  return `Score ${value}`;
};

/** Get 1-10 score from given mark value */
export const getNumbericScore = (score: string) => {
  return score === '0' ? 1 : Math.ceil(Number(score) / 10);
};

export function valueLabelFormat(value: number) {
  return marks.findIndex((mark) => mark.value === value) + 1;
}
