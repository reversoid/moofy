import DoneButton from '@/shared/components/DoneButton';
import EditButton from '@/shared/components/EditButton';
import { formatDate } from '@/shared/lib/formatDate/formatDate';
import { Loading, Row, Text, Textarea, styled } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { FC, createRef, useEffect, useState } from 'react';
import { profileService } from '../api/profile.service';
import { setProfile, setProfileWithoutLists } from '../model';
import { useEditDescription } from '../lib/useEditDescription';

interface ProfileInfoProps {
  description: string | null;
  createdAt: Date;
  isOwner: boolean;
}

const Description = styled('div', { mb: '$4' });

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

const ProfileInfo: FC<ProfileInfoProps> = ({
  createdAt,
  description,
  isOwner,
}) => {
  const [editMode, setEditMode] = useState(false);

  // Yeah we use ref because onChange with input makes impossible autosizing rows
  const inputRef = createRef<unknown>();

  const editDescriptionMutation = useEditDescription();

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

      <Row css={{ gap: '$3' }}>
        <Text size="lg" color="$neutral">
          Дата регистрации
        </Text>
        <Text size="lg">{formatDate(createdAt)}</Text>
      </Row>
    </>
  );
};

export default ProfileInfo;
