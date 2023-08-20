import React, { FC } from 'react';
import { Form } from '@/shared/ui/Form/Form';
import { Button, Checkbox, Loading, Text, styled } from '@nextui-org/react';
import { memo, useEffect, useState } from 'react';
import { Field, Form as FinalForm } from 'react-final-form';
import Counter from './Counter';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { ReviewFormData } from './ReviewModal';

const ScoreContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
});

const StyledLabel = styled('label', {
  fontSize: '$lg',
  color: '$text',
});

const DEFAULT_SCORE = 7;

export interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => void;
  form?: ReviewFormData;
  loading: boolean;
}

export const ReviewForm: FC<ReviewFormProps> = ({
  onSubmit,
  form,
  loading,
}) => {
  const scoreIsSet = form !== undefined && form.score !== null;
  const shouldIncludeScore = scoreIsSet;

  const [includeScore, setIncludeScore] = useState(shouldIncludeScore);

  useEffect(() => {
    setIncludeScore(shouldIncludeScore);
  }, [form?.score]);

  return (
    <>
      <FinalForm<ReviewFormData>
        initialValues={form}
        onSubmit={(data) =>
          onSubmit({
            score: includeScore ? data.score : null,
            description: data.description,
          })
        }
        render={({ handleSubmit, invalid }) => (
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <Field
                name="description"
                validate={(value) =>
                  value && value.length > 400
                    ? 'Слишком длинное описание'
                    : undefined
                }
              >
                {({ input }) => (
                  <Textarea
                    maxLength={400}
                    bordered
                    size="xl"
                    label="Описание"
                    placeholder="Ваше описание фильма"
                    {...input}
                    maxRows={Infinity}
                  />
                )}
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
                isSelected={includeScore}
                onChange={setIncludeScore}
              />

              <Field
                initialValue={form?.score ?? DEFAULT_SCORE}
                component={ScoreContainer}
                name="score"
              >
                {({ input }) => (
                  <ScoreContainer>
                    <StyledLabel htmlFor="slider">Оценка</StyledLabel>
                    <Counter fieldInputProps={input} disabled={!includeScore} />
                  </ScoreContainer>
                )}
              </Field>
            </ModalBody>

            <ModalFooter>
              <Button
                disabled={invalid}
                type="submit"
                color={'gradient'}
                css={{
                  minWidth: '7.5rem',
                  margin: 0,
                  '@xsMax': { width: '100%' },
                }}
                auto
                size="lg"
              >
                {loading ? (
                  <Loading size="lg" type="points" color="white" />
                ) : (
                  'Добавить'
                )}
              </Button>
            </ModalFooter>
          </form>
        )}
      />
    </>
  );
};
