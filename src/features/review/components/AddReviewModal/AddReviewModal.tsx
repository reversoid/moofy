import {
  $createReviewState,
  clearState,
  createReview,
} from '@/models/reviews/createReview';
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
import {
  StyledSlider,
  ariaValueText,
  getNumbericScore,
  marks,
  valueLabelFormat,
} from '../Slider/Slider';
import Counter from '../Counter/Counter';

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
  score: number;
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
    getValues,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      score: 5,
    },
  });

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

      <Modal.Body css={{ '@xsMax': { padding: '$sm' } }}>
        <Form
          onSubmit={handleSubmit(({ description, score }) =>
            onSubmit({
              filmId: film?.id ?? '-1',
              description,
              score: score,
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
          <StyledLabel htmlFor="slider">Оценка</StyledLabel>
          <Counter
            getValue={() => Number(getValues().score)}
            registerReturn={register('score', {
              onChange(event) {
                let currentValue = Number(event.target.value);                

                if (currentValue === null) {
                  event.target.value = 1
                }

                if (currentValue < 1) {
                  event.target.value = 1
                }

                if (currentValue > 10) {
                  event.target.value = 10
                }

                return event
              },
            })}
            setValue={(newValue) => setValue('score', newValue)}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer css={{ '@xsMax': { padding: '$sm' } }}>
        <Button
          disabled={!isValid}
          type="submit"
          form="add-review-modal-form"
          color={'gradient'}
          css={{ minWidth: '7.5rem', margin: 0 }}
          auto
          size="lg"
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
