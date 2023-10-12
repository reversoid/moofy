import { RegisterOptions } from 'react-hook-form';
import { FormData } from '../ui/CreateListForm';

export const NAME_OPTIONS: RegisterOptions<FormData, 'name'> = {
  maxLength: {
    value: 32,
    message: 'Слишком длинное название',
  },
  required: {
    value: true,
    message: 'Поле не должно быть пустым',
  },
};

export const DESCRIPTION_OPTIONS: RegisterOptions<FormData, 'description'> = {
  maxLength: {
    value: 400,
    message: 'Слишком длинное описание',
  },
};
