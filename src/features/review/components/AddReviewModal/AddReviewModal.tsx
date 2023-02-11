import { Form } from '@/shared/ui/Form';
import { Slider } from '@mui/material';
import { Button, Modal, Text, Textarea, styled } from '@nextui-org/react';

const marks = [
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

const StyledSlider = styled(Slider, {
  '& .MuiSlider-markLabel': {
    fontFamily: 'inherit',
    color: '$text',
    fontWeight: 'bold',
  },
  '& .MuiSlider-thumb': {
    background: '$primary',
  },
  '& .MuiSlider-track': {
    background: '$primary',
  },
});

const ariaValueText = (value: number, index: number) => {
  return `Score ${value}`;
};

interface AddFilmModalProps {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
}

const SliderContainer = styled('div', {
  paddingBottom: '1rem',
});

const StyledLabel = styled('label', {
  fontSize: '$lg',
  color: '$text',
});

function valueLabelFormat(value: number) {
  return marks.findIndex((mark) => mark.value === value) + 1;
}

const AddFilmModal = ({ isOpen, setIsOpen }: AddFilmModalProps) => {
  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      width="45rem"
    >
      <Modal.Header css={{ paddingBottom: '$3' }}>
        <Text h3>Обзор к фильму</Text>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Textarea
            bordered
            size="xl"
            label="Описание"
            placeholder="Ваше описание фильма"
            // {...register('description', {
            //   maxLength: { value: 280, message: 'Слишком длинное описание' },
            // })}
          />

          <SliderContainer>
            <StyledLabel htmlFor="slider">Оценка</StyledLabel>
            <StyledSlider
              id="slider"
              aria-label="Restricted values"
              defaultValue={1}
              valueLabelFormat={valueLabelFormat}
              getAriaValueText={ariaValueText}
              step={null}
              valueLabelDisplay="off"
              marks={marks}
            />
          </SliderContainer>
        </Form>
        {/* <Input
          bordered
          fullWidth
          label="Название списка"
          size="xl"
          placeholder="Название123"
          status={errors.name && 'error'}
          {...register('name', {
            required: { value: true, message: 'Поле не должно быть пустым' },
            maxLength: { value: 32, message: 'Слишком длинное название' },
          })}
        /> */}
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          color={'gradient'}
          auto
          onPress={() => setIsOpen(false)}
        >
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddFilmModal;
