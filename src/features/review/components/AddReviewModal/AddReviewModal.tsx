import { $createReviewState, clearState, createReview } from '@/models/reviews/createReview';
import { Film } from '@/shared/api/types/film.type';
import { Form } from '@/shared/ui/Form';
import {
  Button,
  Loading,
  Modal,
  Text,
  Textarea,
  styled,
} from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StyledSlider, ariaValueText, getNumbericScore, marks, valueLabelFormat } from '../Slider/Slider';

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
              score: getNumbericScore(score),
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
              maxLength: { value: 400, message: 'Слишком длинное описание' },
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
          size='lg'
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
