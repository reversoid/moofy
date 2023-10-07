import { useCreateComment } from '@/features/comment/utils/useCreateComment';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { required } from '@/shared/utils/forms/validators';
import { Button, Loading, styled } from '@nextui-org/react';
import React, { FC } from 'react';
import { Field, Form } from 'react-final-form';

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

  return (
    <Form<ReplyFormValues>
      onSubmit={async (value, form) => {
        await commentMutation.mutateAsync({
          commentId,
          listId,
          text: value.text,
        });
        form.reset();
      }}
    >
      {({ invalid, submitting, handleSubmit, pristine }) => (
        <AnswerWrapper onSubmit={handleSubmit}>
          <Field name="text" validate={required('Поле должно быть заполнено')}>
            {({ input }) => (
              <Textarea
                {...input}
                maxLength={400}
                placeholder={`Ваш ${commentId ? 'ответ' : 'комментарий'}`}
                size="lg"
              />
            )}
          </Field>
          <Button
            type="submit"
            css={{ mt: '$8', '@xsMax': { w: '100%' } }}
            color={'primary'}
            disabled={submitting || invalid || pristine}
          >
            {submitting ? <Loading type="points" /> : 'Отправить'}
          </Button>
        </AnswerWrapper>
      )}
    </Form>
  );
};

export const SendCommentFormWrapper = styled('div', {
  mb: '$2',
  mt: '$6',
});
