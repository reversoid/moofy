import { useReplyToComment } from '@/features/comment/utils/useReplyToComment';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { required } from '@/shared/utils/forms/validators';
import { Button, Loading, styled } from '@nextui-org/react';
import React, { FC } from 'react';
import { Field, Form } from 'react-final-form';

const AnswerWrapper = styled('form', {
  mt: '$7',
  mb: '$5',
});

interface ReplyFormValues {
  text: string;
}

export interface ReplyFormProps {
  commentId: number;
  listId: number;
}

export const ReplyForm: FC<ReplyFormProps> = ({ commentId, listId }) => {
  const replyMutation = useReplyToComment();

  return (
    <Form<ReplyFormValues>
      onSubmit={async (value, form) => {
        await replyMutation.mutateAsync({
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
                placeholder="Ваш ответ"
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
