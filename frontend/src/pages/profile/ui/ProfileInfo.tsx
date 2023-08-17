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
import { useEditDescription } from '../utils/useEditDescription';
import { useAuth } from '@/app';
import { useFollow } from '../utils/useFollow';
import { useUnfollow } from '../utils/useUnfollow';
import { ProfileShort } from '@/shared/api/types/profile.type';

interface ProfileInfoProps {
  isOwner: boolean;
  profile: ProfileShort;
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

const ProfileInfo: FC<ProfileInfoProps> = ({ isOwner, profile }) => {
  const [editMode, setEditMode] = useState(false);
  const { isLoggedIn } = useAuth();

  // Yeah we use ref because onChange with input makes impossible autosizing rows
  const inputRef = createRef<unknown>();

  const editDescriptionMutation = useEditDescription();

  const subscribeMutation = useFollow(profile);
  const unsubscribeMutation = useUnfollow(profile);

  useEffect(() => {
    // TODO can use hook for that?
    if (!inputRef.current) return;
    (inputRef.current as any).value = profile.description ?? '';
  }, [profile.description]);

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

        {isOwner || profile.description ? (
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
          {profile.additionalInfo.isSubscribed ? (
            <Button
              size={'lg'}
              color={'gradient'}
              bordered
              css={{ '@xsMax': { width: '100%' } }}
              onClick={() => unsubscribeMutation.mutate()}
              disabled={subscribeMutation.isLoading}
            >
              {unsubscribeMutation.isLoading ? (
                <Loading type="points" />
              ) : (
                'Отписаться'
              )}
            </Button>
          ) : (
            <Button
              size={'lg'}
              color={'gradient'}
              css={{ '@xsMax': { width: '100%' } }}
              onClick={() => subscribeMutation.mutate()}
              disabled={subscribeMutation.isLoading}
            >
              {subscribeMutation.isLoading ? (
                <Loading type="points" />
              ) : (
                'Подписаться'
              )}
            </Button>
          )}
        </SubscribeContainer>
      )}
    </>
  );
};

export default ProfileInfo;
