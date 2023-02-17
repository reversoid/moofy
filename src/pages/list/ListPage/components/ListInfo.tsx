import { styled, Row, Text, Image, Button } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import gear from '@/assets/img/gear.svg';
import { memo, useState } from 'react';
import UpdateListModal from '@/features/list/components/UpdateListModal/UpdateListModal';
import { List } from '@/shared/api/types/list.type';
import { IconButton } from '@/shared/ui/IconButton';

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
        <Row align="center" justify="space-between" css={{ gap: '$15' }}>
          <Row align="center" css={{ gap: '$10' }}>
            <Text
              h1
              css={{
                flexShrink: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                pr: '0.25rem',
              }}
            >
              {list.name}
            </Text>
            <IconButton
              light
              css={{
                ml: 'auto',
              }}
              onPress={() => setIsUpdateDialogOpen(true)}
            >
              <Image src={gear} height={'1.5rem'} width={'1.5rem'}></Image>
            </IconButton>
          </Row>
        </Row>

        <Text as={'p'} css={{ mb: '$5', fontSize: '$xl', wordBreak: 'break-word' }}>
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
        listData={{
          description: list.description,
          isPrivate: !list.is_public,
          name: list.name,
        }}
      />
    </>
  );
};

export default memo(ListInfo);
