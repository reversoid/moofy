import { formatDate } from '@/shared/lib/formatDate/formatDate';
import { Row, Text, styled } from '@nextui-org/react';
import { FC } from 'react';

interface ProfileInfoProps {
  description: string | null;
  createdAt: Date;
}

const Description = styled('div', { mb: '$4' });

const ProfileInfo: FC<ProfileInfoProps> = ({ createdAt, description }) => {
  return (
    <>
      <Description>
        <Text h3>Описание</Text>
        <Text dangerouslySetInnerHTML={{ __html: description ?? '' }}></Text>
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
