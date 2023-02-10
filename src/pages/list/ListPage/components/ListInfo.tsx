import { List } from '@/features/list/services/list.service';
import { styled, Row, Text, Image, Button } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import lock from '@/assets/img/lock.svg';
import gear from '@/assets/img/gear.svg';
import { useState } from 'react';
import UpdateListModal from '@/features/list/components/UpdateListModal/UpdateListModal';

const ListInfoContainer = styled('div', {
  mb: '$10',
});

interface ListInfoProps {
  list: List;
  isUserOwner: boolean;
}

const ListInfo = ({ list, isUserOwner }: ListInfoProps) => {
  const getUpdatedAt = () => {
    const date = new Date(list.updated_at);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  return (
    <>
      <ListInfoContainer>
        <Row align="center" justify="space-between">
          <Row align="center" css={{ gap: '$10' }}>
            <Text h1>{list.name}</Text>
            {!list.is_public && (
              <div>
                <Image src={lock} height={'1.5rem'} width={'1.5rem'}></Image>
              </div>
            )}
          </Row>
          <Button
            light
            css={{ width: '1.5rem', height: '1.5rem', p: 0, minWidth: 'auto' }}
            onPress={() => setIsUpdateDialogOpen(true)}
          >
            <Image src={gear} height={'1.5rem'} width={'1.5rem'}></Image>
          </Button>
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
      <UpdateListModal
        isOpen={isUpdateDialogOpen}
        listId={list.id}
        setIsOpen={setIsUpdateDialogOpen}
        form={{
          description: list.description,
          isPrivate: !list.is_public,
          name: list.name,
        }}
      />
    </>
  );
};

export default ListInfo;
