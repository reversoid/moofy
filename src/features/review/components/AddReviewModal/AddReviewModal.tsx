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
import Counter from '../Counter/Counter';
import { decreasedPaddingMobileModal } from '@/shared/ui/styles';
import { useNavigate } from 'react-router-dom';

interface AddReviewModalProps {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  film?: Film;
  listId: number;
}

const ScoreContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
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
      score: 7,
    },
  });

  const navigate = useNavigate()

  const onSubmit = useEvent(createReview);
  const onCloseModal = useEvent(clearState);

  const { loading, success } = useStore($createReviewState);

  const handleClose = () => {
    setIsOpen(false);
    onCloseModal();
    setValue('description', '')
    setValue('score', 7)
  };

  useEffect(() => {
    if (!success) return;
    handleClose();
    navigate('../')
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

      <Modal.Body css={decreasedPaddingMobileModal}>
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
          <ScoreContainer>
            <StyledLabel htmlFor="slider">Оценка</StyledLabel>
            <Counter
              getValue={() => Number(getValues().score)}
              registerReturn={register('score')}
              setValue={(newValue) => setValue('score', newValue)}
            />
          </ScoreContainer>
        </Form>
      </Modal.Body>
      <Modal.Footer css={decreasedPaddingMobileModal}>
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
