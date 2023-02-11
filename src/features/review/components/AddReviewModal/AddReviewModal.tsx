import { Film } from '@/features/list/services/list.service';
import {
  $createReviewState,
  clearState,
  createReview,
} from '@/models/reviews';
import { Form } from '@/shared/ui/Form';
import { Slider } from '@mui/material';
import {
  Button,
  Loading,
  Modal,
  Text,
  Textarea,
  styled,
} from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

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

const ariaValueText = (value: number, index: number) => {
  return `Score ${value}`;
};

interface AddReviewModalProps {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  film?: Film;
  listId: number;
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

interface FormData {
  description: string;
  score: string;
}

const AddReviewModal = ({
  isOpen,
  setIsOpen,
  film,
  listId,
}: AddReviewModalProps) => {
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm<FormData>();

  const onSubmit = useEvent(createReview);
  const onCloseModal = useEvent(clearState);

  const { loading, success } = useStore($createReviewState);

  const handleClose = () => {
    onCloseModal();
    setIsOpen(false);
  };

  useEffect(() => {
    if (!success) return;
    handleClose();
  }, [success]);

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
        <Form
          onSubmit={handleSubmit(({ description, score }) =>
            onSubmit({
              filmId: film?.id ?? '-1',
              description,
              score: Math.ceil(Number(score) / 10) * 10,
              listId,
            }),
          )}
          id="add-review-modal-form"
        >
          <Textarea
            bordered
            size="xl"
            label="Описание"
            placeholder="Ваше описание фильма"
            {...register('description', {
              maxLength: { value: 280, message: 'Слишком длинное описание' },
            })}
          />

          <SliderContainer>
            <StyledLabel htmlFor="slider">Оценка</StyledLabel>
            <StyledSlider
              id="slider"
              aria-label="Restricted values"
              valueLabelFormat={valueLabelFormat}
              getAriaValueText={ariaValueText}
              step={null}
              valueLabelDisplay="off"
              marks={marks}
              {...register('score')}
            />
          </SliderContainer>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={!isValid}
          type="submit"
          form="add-review-modal-form"
          color={'gradient'}
          css={{ minWidth: '6.5rem' }}
          auto
        >
          {loading ? (
            <Loading size="lg" type="points" color="white" />
          ) : (
            'Добавить'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddReviewModal;
