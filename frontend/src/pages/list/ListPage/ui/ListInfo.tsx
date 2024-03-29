import { HEADING_STYLES } from '@/app/providers/UIProvider/headingStyles';
import { DeleteListModal } from '@/features/list/delete-list';
import { UpdateListModal } from '@/features/list/update-list';
import { AdditinalInfo, List } from '@/shared/api/types/list.type';
import { formatDate } from '@/shared/utils/formatDate/formatDate';
import { Row, styled, Text } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteList } from '../../../../features/list/delete-list/utils/useDeleteList';
import { ListHeader } from './ListHeader';
import { CommentsList } from './CommentsList/CommentsList';
import { Feedback } from './Feedback';

const ListInfoContainer = styled('div', {
  mb: '$9',
});

interface ListInfoProps {
  list: List;
  isUserOwner: boolean;
  isFavorite?: boolean;
  additionalInfo?: AdditinalInfo;
}

export const ListInfo = ({
  list,
  isUserOwner,
  isFavorite,
  additionalInfo,
}: ListInfoProps) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const navigate = useNavigate();

  const deleteListmutation = useDeleteList();

  useEffect(() => {
    if (!deleteListmutation.isSuccess) {
      return;
    }
    setIsDeleteDialogOpen(false);
    navigate('/welcome/collections');
  }, [deleteListmutation.isSuccess]);

  return (
    <>
      <ListInfoContainer>
        <ListHeader
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
              ...HEADING_STYLES.h1,
              fontSize: '$xl !important',
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

      {additionalInfo && (
        <Feedback additionalInfo={additionalInfo} listId={list.id} />
      )}

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

      <DeleteListModal
        isDialogOpen={isDeleteDialogOpen}
        setIsDialogOpen={setIsDeleteDialogOpen}
        listId={list.id}
      />
    </>
  );
};
