import DoneButton from '@/shared/components/DoneButton';
import EditButton from '@/shared/components/EditButton';
import GearButton from '@/shared/components/GearButton';
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

const ProfileInfo: FC<ProfileInfoProps> = ({
  createdAt,
  description,
  isOwner,
}) => {
  const [editMode, setEditMode] = useState(false);
  const { bindings, setValue, value } = useInput(description ?? '');

  const { loading, result } = useStore($editProfileState);

  useEffect(() => {
    setValue(description ?? '');
  }, [description]);

  useEffect(() => {
    setValue(result?.description ?? '');
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
                  {loading ? (
                    <Loading size="sm" />
                  ) : (
                    <DoneButton
                      onClick={() =>
                        editProfileDescription({ newValue: value })
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
        {editMode ? (
          <Textarea
            width="100%"
            size="lg"
            placeholder="Ваше описание"
            minRows={2}
            maxRows={10}
            {...bindings}
            readOnly={loading}
          />
        ) : description ? (
          <Text dangerouslySetInnerHTML={{ __html: description ?? '' }}></Text>
        ) : (
          <Text color="$neutral">Описание отсутствует</Text>
        )}
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
