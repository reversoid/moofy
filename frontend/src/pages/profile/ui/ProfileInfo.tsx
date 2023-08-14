import DoneButton from '@/shared/components/DoneButton';
import EditButton from '@/shared/components/EditButton';
import {
  Button,
  Loading,
  Row,
  Text,
  Textarea,
  styled,
} from '@nextui-org/react';
import { FC, createRef, useEffect, useState } from 'react';
import { useEditDescription } from '../lib/useEditDescription';
import { useAuth } from '@/app';
import { useSubscribe } from '../lib/useSubscribe';
import { useUnsubscribe } from '../lib/useUnsubscribe';

interface ProfileInfoProps {
  description: string | null;
  isOwner: boolean;
  isSubscribed: boolean;
  userId: number
}

const Description = styled('div', { mb: '$4', mt: '$10' });

const AnimatedTextarea = styled(Textarea, {
  '& textarea': {
    transition:
      '0.12s margin ease-in-out, 0.12s background-color ease-in-out, 0.12s border-radius ease-in-out',
  },

  '& label': {
    cursor: 'default !important',
  },

  '& textarea:read-only, & textarea:disabled, & textarea': {
    color: '$text !important',
  },

  variants: {
    read: {
      true: {
        label: {
          background: 'transparent',
          borderRadius: 0,
        },
        textarea: {
          marginLeft: '0 !important',
          marginRight: '0 !important',
          cursor: 'default',
        },
      },
    },
  },
});

const SubscribeContainer = styled('div');

const ProfileInfo: FC<ProfileInfoProps> = ({
  description,
  isOwner,
  isSubscribed,
  userId
}) => {
  const [editMode, setEditMode] = useState(false);
  const { isLoggedIn } = useAuth();

  // Yeah we use ref because onChange with input makes impossible autosizing rows
  const inputRef = createRef<unknown>();

  const editDescriptionMutation = useEditDescription();

  const subscribeMutation = useSubscribe();
  const unsubscribeMutation = useUnsubscribe();

  useEffect(() => {
    // TODO can use hook for that?
    if (!inputRef.current) return;
    (inputRef.current as any).value = description ?? '';
  }, [description]);

  useEffect(() => {
    if (!editDescriptionMutation.isSuccess) return;
    if (!inputRef.current) return;
    (inputRef.current as any).value =
      editDescriptionMutation.data.description ?? '';
    setEditMode(false);
  }, [editDescriptionMutation.isSuccess]);

  return (
    <>
      <Description>
        <Row justify="space-between" align="center" css={{ mb: '$5' }}>
          <Text h3 css={{ margin: 0 }}>
            Описание
          </Text>
          {isOwner && (
            <>
              {editMode ? (
                <>
                  {editDescriptionMutation.isLoading ? (
                    <Loading size="sm" />
                  ) : (
                    <DoneButton
                      onClick={() => {
                        editDescriptionMutation.mutate(
                          (inputRef.current as any).value,
                        );
                      }}
                    />
                  )}
                </>
              ) : (
                <EditButton onClick={() => setEditMode(true)} />
              )}
            </>
          )}
        </Row>

        {isOwner || description ? (
          <AnimatedTextarea
            width="100%"
            size="lg"
            placeholder="Ваше описание"
            minRows={2}
            read={!editMode}
            readOnly={!editMode || editDescriptionMutation.isLoading}
            disabled={!editMode}
            maxRows={Infinity}
            ref={inputRef as any}
          />
        ) : (
          <Text color="$neutral">Описание отсутствует</Text>
        )}
      </Description>

      {isLoggedIn && !isOwner && (
        <SubscribeContainer css={{ mt: '$8' }}>
          {isSubscribed ? (
            <Button
              size={'lg'}
              color={'gradient'}
              bordered
              css={{ '@xsMax': { width: '100%' } }}
              onClick={() => unsubscribeMutation.mutate(userId)}
            >
              Отписаться
            </Button>
          ) : (
            <Button
              size={'lg'}
              color={'gradient'}
              css={{ '@xsMax': { width: '100%' } }}
              onClick={() => subscribeMutation.mutate(userId)}
            >
              Подписаться
            </Button>
          )}
        </SubscribeContainer>
      )}
    </>
  );
};

export default ProfileInfo;
