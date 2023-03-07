import { Form } from '@/shared/ui/Form';
import {
  decreasedPaddingMobile,
  increasedPaddingBottom,
} from '@/shared/ui/modalStyles';
import {
  Button,
  Checkbox,
  Loading,
  Modal,
  Text,
  Textarea,
  styled,
} from '@nextui-org/react';
import { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Counter from '../Counter/Counter';
import TextareaCount from '@/shared/ui/TextareaCount';

const ScoreContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
});

const StyledLabel = styled('label', {
  fontSize: '$lg',
  color: '$text',
});

export interface ReviewFormData {
  description: string;
  score: number | null;
}

export interface ReviewModalProps {
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
  form?: ReviewFormData;

  state: {
    loading: boolean;
    success: boolean;
  };
  handlers: {
    onSubmit: (data: ReviewFormData) => any;
    onSuccess: () => void;
  };
}

/** Provides basis for update and create review modal */
const ReviewModal = ({
  isOpen,
  setIsOpen,
  form,
  handlers,
  state,
}: ReviewModalProps) => {
  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
  } = useForm<ReviewFormData>({ defaultValues: form });

  useEffect(() => {
    setValue('description', form?.description ?? '');
    setValue('score', form?.score ?? 7);
  }, [form]);

  useEffect(() => {
    if (!state.success) {
      return;
    }
    handlers.onSuccess();
  }, [state.success]);

  const [includeScore, setIncludeScore] = useState(form === undefined || form?.score !== null);

  useEffect(() => {
    setIncludeScore(form?.score !== null);
  }, [form?.score]);

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

      <Modal.Body css={decreasedPaddingMobile}>
        <Form
          onSubmit={handleSubmit((data) => {
            handlers.onSubmit({
              ...data,
              score: includeScore ? data.score : null,
            });
          })}
          id="add-review-modal-form"
        >
          <TextareaCount
            maxLength={400}
            bordered
            size="xl"
            label="Описание"
            placeholder="Ваше описание фильма"
            {...register('description', {
              maxLength: { value: 400, message: 'Слишком длинное описание' },
            })}
            initialValue={getValues('description')}
          />
          <Checkbox
            color="gradient"
            label="Включить оценку"
            css={{
              '& .nextui-checkbox-text': {
                fontSize: '$lg',
              },
            }}
            size="lg"
            defaultSelected={includeScore}
            onChange={(newValue) => setIncludeScore(newValue)}
          />
          <ScoreContainer>
            <StyledLabel htmlFor="slider">Оценка</StyledLabel>
            <Counter
              getValue={() => Number(getValues().score)}
              registerReturn={register('score')}
              setValue={(newValue) => setValue('score', newValue)}
              disabled={!includeScore}
            />
          </ScoreContainer>
        </Form>
      </Modal.Body>
      <Modal.Footer
        css={{ ...decreasedPaddingMobile, ...increasedPaddingBottom }}
      >
        <Button
          disabled={!isValid}
          type="submit"
          form="add-review-modal-form"
          color={'gradient'}
          css={{ minWidth: '7.5rem', margin: 0, '@xsMax': { width: '100%' } }}
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
