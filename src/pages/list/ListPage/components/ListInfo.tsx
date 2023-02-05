import { List } from '@/features/list/services/list.service';
import { styled, Row, Text, Image } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import lock from '@/assets/img/lock.svg';

const ListInfoContainer = styled('div', {
  mb: '$10',
});

interface ListInfoProps { list: List, isUserOwner: boolean }

const ListInfo = ({ list, isUserOwner }: ListInfoProps) => {
  const getUpdatedAt = () => {
    const date = new Date(list.updated_at);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + date.getMonth()).slice(-2);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <ListInfoContainer>
      <Row align="center" css={{ gap: '$10' }}>
        <Text h1>{list.name}</Text>
        {!list.is_public && (
          <div>
            <Image src={lock} height={'1.5rem'} width={'1.5rem'}></Image>
          </div>
        )}
      </Row>
      <Text as={'p'} css={{ mb: '$5', fontSize: '$xl' }}>
        {list.description}
      </Text>

      <Text as={'p'} color="$neutral">
        Создатель{' '}
        <Link to={`/profile/${list.user.id}`}>{list.user.username}</Link>
      </Text>
      <Text as={'p'} color="$neutral">
        Обновлен {getUpdatedAt()}
      </Text>
    </ListInfoContainer>
  );
};

export default ListInfo;
