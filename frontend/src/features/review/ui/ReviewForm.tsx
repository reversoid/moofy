import React, { FC } from 'react';
import { Button, Checkbox, Loading, styled } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import Counter from './Counter';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { ReviewFormData } from './ReviewModal';
import { useForm } from 'react-hook-form';

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

  const {
    register,
    formState: { isValid },
    handleSubmit,
    getValues,
    setValue,
  } = useForm<ReviewFormData>({
    defaultValues: form,
  });

  return (
    <>
      <form
        onSubmit={handleSubmit((form) =>
          onSubmit({
            score: includeScore ? form.score : null,
            description: form.description,
          }),
        )}
      >
        <ModalBody>
          <Textarea
            maxLength={400}
            bordered
            size="xl"
            label="Описание"
            placeholder="Ваше описание фильма"
            initialValue={form?.description}
            {...register('description', { maxLength: 400 })}
            maxRows={Infinity}
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
            isSelected={includeScore}
            onChange={setIncludeScore}
          />

          <ScoreContainer>
            <StyledLabel>Оценка</StyledLabel>
            <Counter
              getValue={() => Number(getValues('score'))}
              registerReturn={register('score')}
              setValue={(newValue) => setValue('score', newValue)}
              disabled={!includeScore}
            />
          </ScoreContainer>
        </ModalBody>

        <ModalFooter>
          <Button
            disabled={!isValid || loading}
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
    </>
  );
};
