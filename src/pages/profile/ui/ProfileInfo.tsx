import DoneButton from '@/shared/components/DoneButton';
import EditButton from '@/shared/components/EditButton';
import { formatDate } from '@/shared/lib/formatDate/formatDate';
import {
  Loading,
  Row,
  Text,
  Textarea,
  styled,
  useInput,
} from '@nextui-org/react';
import { useStore } from 'effector-react';
import { FC, useEffect, useState } from 'react';
import {
  $editProfileState,
  editProfileDescription,
} from '../model/editProfileDescription';

interface ProfileInfoProps {
  description: string | null;
  createdAt: Date;
  isOwner: boolean;
}

const Description = styled('div', { mb: '$4' });

const AnimatedTextarea = styled(Textarea, {
  '*': { transition: '0.12s all ease-in-out' },

  variants: {
    read: {
      true: {
        label: {
          background: 'transparent',
          borderRadius: 0,
        },
        textarea: {
          margin: '0 !important',
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
  const { bindings, setValue: setInputValue, value: inputValue } = useInput(description ?? '');

  const { loading: editLoading, result } = useStore($editProfileState);

  useEffect(() => {
    setInputValue(description ?? '');
  }, [description]);

  useEffect(() => {
    if (!result) return;

    setInputValue(result?.description ?? '');
    setEditMode(false);
  }, [result]);

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
                  {editLoading ? (
                    <Loading size="sm" />
                  ) : (
                    <DoneButton
                      onClick={() =>
                        editProfileDescription({ newValue: inputValue })
                      }
                    />
                  )}
                </>
              ) : (
                <EditButton onClick={() => setEditMode(true)} />
              )}
            </>
          )}
        </Row>

        <AnimatedTextarea
          width="100%"
          size="lg"
          placeholder="Ваше описание"
          minRows={2}
          maxRows={10}
          read={!editMode}
          readOnly={!editMode || editLoading}
          {...bindings}
        />
      </Description>

      <Row css={{ gap: '$3', mb: '$5' }}>
        <Text size="lg" color="$neutral">
          Дата регистрации
        </Text>
        <Text size="lg">{formatDate(createdAt)}</Text>
      </Row>
    </>
  );
};

export default ProfileInfo;
