import DoneButton from '@/shared/components/DoneButton';
import EditButton from '@/shared/components/EditButton';
import GearButton from '@/shared/components/GearButton';
import { formatDate } from '@/shared/lib/formatDate/formatDate';
import { Row, Text, Textarea, styled, useInput } from '@nextui-org/react';
import { FC, useState } from 'react';

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
  const { bindings } = useInput(description ?? '');

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
                <DoneButton onClick={() => setEditMode(false)} />
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
          />
        ) : (
          <Text dangerouslySetInnerHTML={{ __html: description ?? '' }}></Text>
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
