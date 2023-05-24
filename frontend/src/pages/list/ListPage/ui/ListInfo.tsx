import { styled, Text } from '@nextui-org/react';
import { Link, useNavigate } from 'react-router-dom';
import { lazy, useEffect, useState } from 'react';
import { List } from '@/shared/api/types/list.type';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import { useStore } from 'effector-react';
import { formatDate } from '@/shared/lib/formatDate/formatDate';
import {
  $deleteListState,
  clearState,
  deleteList,
} from '@/features/list/delete-list';
import {
  $addToFavoritesLoading,
  $removeFromFavoritesLoading,
} from '@/features/list/favorite-lists';
import DeleteModalContent from '@/features/list/delete-list/ui/DeleteListModalContent';
import { ListHeader } from './ListHeader';
import { UpdateListModal } from '@/features/list/update-list';

const ListInfoContainer = styled('div', {
  mb: '$10',
});

interface ListInfoProps {
  list: List;
  isUserOwner: boolean;
  isFavorite?: boolean;
}

export const ListInfo = ({ list, isUserOwner, isFavorite }: ListInfoProps) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
        <ListHeader
          bookmarkButtonDisabled={addToFavsLoading || removeFromFavsLoading}
          isFavorite={Boolean(isFavorite)}
          isUserOwner={isUserOwner}
          listId={list.id}
          listName={list.name}
          onClickDelete={() => setIsDeleteDialogOpen(true)}
          onClickUpdate={() => setIsUpdateDialogOpen(true)}
        />

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
          Обновлен <Text as="span">{formatDate(list.updated_at)}</Text>
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
        listImageUrl={list.image_url}
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
