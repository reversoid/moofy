import { styled, Row, Text, Image, Button } from '@nextui-org/react';
import { Link, useNavigate } from 'react-router-dom';
import { memo, useEffect, useState } from 'react';
import UpdateListModal from '@/features/list/components/UpdateListModal/UpdateListModal';
import { List } from '@/shared/api/types/list.type';
import Dropdown, { Option } from '@/shared/ui/Dropdown/Dropdown';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import DeleteModalContent from './DeleteListModalContent';
import { useStore } from 'effector-react';
import {
  $deleteListState,
  clearState,
  deleteList,
} from '@/models/lists/deleteList';
import BookmarkButton from '@/features/add-list-to-favorites/ui/BookmarkButton';
import {
  $addToFavoritesLoading,
  addToFavorites,
} from '@/models/favoriteLists/addToFavorites';
import {
  $removeFromFavoritesLoading,
  removeFromFavorites,
  removeFromFavoritesFx,
} from '@/models/favoriteLists/removeFromFavorites';
import GearButton from '@/shared/components/GearButton';


const ListInfoContainer = styled('div', {
  mb: '$10',
});

interface ListInfoProps {
  list: List;
  isUserOwner: boolean;
  isFavorite?: boolean;
}

const ListHeader = ({ list, isUserOwner, isFavorite }: ListInfoProps) => {
  const getUpdatedAt = () => {
    const date = new Date(list.updated_at);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const dropdownOptions: Option[] = [
    {
      label: 'Изменить',
      key: 'update',
      callback: () => setIsUpdateDialogOpen(true),
    },
    {
      label: 'Удалить',
      key: 'delete',
      callback: () => setIsDeleteDialogOpen(true),
      color: 'error',
    },
  ];

  const { loading, success: deleteSuccess } = useStore($deleteListState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!deleteSuccess) {
      return;
    }
    clearState();
    setIsDeleteDialogOpen(false);
    navigate('/welcome');
  }, [deleteSuccess]);

  const addToFavsLoading = useStore($addToFavoritesLoading);
  const removeFromFavsLoading = useStore($removeFromFavoritesLoading);

  return (
    <>
      <ListInfoContainer>
        <Row
          align="center"
          css={{
            gap: '$10',
            justifyContent: 'space-between',
            mb: '$12',
            '@xsMax': { mb: '$10' },
          }}
        >
          <Text
            h1
            css={{
              flexShrink: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              pr: '0.25rem',
              mb: '0 !important',
            }}
          >
            {list.name}
          </Text>

          {isUserOwner ? (
            <Dropdown
              trigger={<GearButton />}
              options={dropdownOptions}
              placement="left"
            />
          ) : (
            <BookmarkButton
              onClick={() =>
                isFavorite
                  ? removeFromFavorites({ listId: list.id })
                  : addToFavorites({ listId: list.id })
              }
              disabled={addToFavsLoading || removeFromFavsLoading}
              iconFilled={isFavorite}
            />
          )}
        </Row>

        {list.description && (
          <Text
            as={'p'}
            css={{
              mb: '$12',
              '@xsMax': {
                marginBottom: '$10',
              },
              fontSize: '$xl',
              wordBreak: 'break-word',
            }}
          >
            {list.description}
          </Text>
        )}

        {isUserOwner ? (
          <Text as={'p'} color="$neutral">
            {list.is_public ? 'Публичная' : 'Приватная'} коллекция
          </Text>
        ) : (
          <Text as={'p'} color="$neutral">
            Создатель{' '}
            <Link to={`/profile/${list.user.id}`}>{list.user.username}</Link>
          </Text>
        )}

        <Text as={'p'} color="$neutral">
          Обновлен <Text as="span">{getUpdatedAt()}</Text>
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
      <ConfirmModal
        content={<DeleteModalContent />}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        loading={loading}
        submitText="Удалить"
        onSubmit={() => deleteList({ listId: list.id })}
        buttonColor="error"
      />
    </>
  );
};

export default memo(ListHeader);
