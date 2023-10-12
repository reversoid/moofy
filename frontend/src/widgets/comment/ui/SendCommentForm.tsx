import { useCreateComment } from '@/features/comment/utils/useCreateComment';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Button, Loading, styled } from '@nextui-org/react';
import React, { FC } from 'react';
import { useForm } from 'react-hook-form';

const AnswerWrapper = styled('form');

interface ReplyFormValues {
  text: string;
}

export interface ReplyFormProps {
  /** If commentId is not set, will send comments to list */
  commentId?: number;
  listId: number;
}

export const SendCommentForm: FC<ReplyFormProps> = ({ commentId, listId }) => {
  const commentMutation = useCreateComment();
  const {
    register,
    formState: { isValid, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<ReplyFormValues>();

  return (
    <AnswerWrapper
      onSubmit={handleSubmit(async ({ text }) => {
        await commentMutation.mutateAsync({
          commentId,
          listId,
          text: text,
        });
        reset();
      })}
    >
      <Textarea
        {...register('text', { required: true })}
        maxLength={400}
        placeholder={`Ваш ${commentId ? 'ответ' : 'комментарий'}`}
        size="lg"
      />

      <Button
        type="submit"
        css={{ mt: '$8', '@xsMax': { w: '100%' } }}
        color={'primary'}
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? <Loading type="points" /> : 'Отправить'}
      </Button>
    </AnswerWrapper>
  );
};

export const SendCommentFormWrapper = styled('div', {
  mb: '$2',
  mt: '$6',
});
