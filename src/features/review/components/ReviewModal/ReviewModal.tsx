import { Form } from '@/shared/ui/Form';
import { decreasedPaddingMobileModal } from '@/shared/ui/styles';
import {
    Button,
    Loading,
    Modal,
    Text,
    Textarea,
    styled,
} from '@nextui-org/react';
import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Counter from '../Counter/Counter';

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

export interface ReviewModalProps {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  form?: FormData;

  state: {
    loading: boolean;
    success: boolean;
  };
  handlers: {
    onSubmit: (data: FormData) => any;
    onSuccess: () => void;
  };
}

const ReviewModal = ({
  isOpen,
  setIsOpen,
  form,
  handlers,
  state
}: ReviewModalProps) => {
  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
  } = useForm<FormData>({ defaultValues: form });

  useEffect(() => {
    setValue('description', form?.description ?? '')
    setValue('score', form?.score ?? 7)
  }, [form])

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
          onSubmit={handleSubmit((data) =>
            handlers.onSubmit(data),
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
          {state.loading ? (
            <Loading size="lg" type="points" color="white" />
          ) : (
            'Добавить'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default memo(ReviewModal);
