import { useReplyToComment } from '@/features/comment/utils/useReplyToComment';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Button, styled } from '@nextui-org/react';
import React, { FC } from 'react';
import { Field, Form } from 'react-final-form';

const AnswerWrapper = styled('form', {
  mt: '$10',
});

export interface ReplyFormProps {
  commentId: number;
  listId: number;
}

export const ReplyForm: FC<ReplyFormProps> = ({ commentId, listId }) => {
  const replyMutation = useReplyToComment();

  return (
    <Form
      onSubmit={() =>
        replyMutation.mutate({ commentId, listId, text: 'some reply' })
      }
    >
      {({}) => (
        <AnswerWrapper>
          <Field name="text">
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
            disabled={replyMutation.isLoading}
            onClick={() =>
              replyMutation.mutate({
                commentId: commentId,
                listId: listId,
                text: 'test reply',
              })
            }
          >
            Отправить
          </Button>
        </AnswerWrapper>
      )}
    </Form>
  );
};
