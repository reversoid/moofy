import { Form } from '@/shared/ui/Form/Form';
import { Button, Checkbox, Loading, Text, styled } from '@nextui-org/react';
import { memo, useEffect, useState } from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import Counter from './Counter';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';

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

  const DEFAULT_SCORE = 7;
  const [includeScore, setIncludeScore] = useState(
    form !== undefined && form.score !== null,
  );



  useEffect(() => {
    if (!state.success) {
      return;
    }
    handlers.onSuccess();
  }, [state.success]);

  useEffect(() => {
    setIncludeScore(form !== undefined && form.score !== null);
  }, [form?.score]);

  return (
    <>
      <FinalForm<ReviewFormData>
        initialValues={form}
        onSubmit={handlers.onSubmit}
        render={({ handleSubmit, invalid }) => (
          <>
          <Modal
            closeButton
            aria-labelledby="modal-title"
            open={isOpen}
            onClose={() => setIsOpen(false)}
            >
      <ModalHeader css={{ paddingBottom: '$3' }}>
        <Text h3>Обзор к фильму</Text>
      </ModalHeader>
      
      <ModalBody>
        <Form
            css={{ mb: '$10' }}
            id="add-review-modal-form"
            onSubmit={handleSubmit}
            > 
          <Field
            name="description"
            validate={(value) =>
            value && value.length > 400 ? 'Слишком длинное описание' : undefined
          }>
            {({ input }) => (
          <Textarea
            maxLength={400}
            bordered
            size="xl"
            label="Описание"
            placeholder="Ваше описание фильма"
            {...input}
            maxRows={Infinity}
          />)}
          </Field>
          
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
          
          <Field
            initialValue={form?.score ?? DEFAULT_SCORE}
            component={ScoreContainer}
            name='score'>
            {({ input }) => (
            <ScoreContainer>
              <StyledLabel htmlFor="slider">Оценка</StyledLabel>
              <Counter
                getValue={() => input.value}
                setValue={newValue => input.onChange(Number(newValue)) }
                disabled={!includeScore}
                score={Number(input.value)}
              />
            </ScoreContainer>)}
          </Field>
         </Form>
        </ModalBody>
      
        <ModalFooter>
          <Button
            disabled={invalid}
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
      </ModalFooter>
    </Modal>
    </>
    )}
  />
  </>
  )
};
 

export default memo(ReviewModal);