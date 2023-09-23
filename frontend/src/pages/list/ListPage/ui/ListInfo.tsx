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
import { ListLike } from '@/features/list-like';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import commentIcon from '@/shared/assets/img/comment.svg';
import { Icon } from '@/shared/ui/Icon/Icon';

const ListInfoContainer = styled('div', {
  mb: '$10',
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

      <Row css={{ ai: 'center', gap: '$10', jc: 'flex-start' }}>
        <Row css={{ ai: 'center', gap: '$3', w: 'auto' }}>
          <ListLike liked={additionalInfo?.isLiked ?? false} listId={list.id} />
          <Text css={{ fontWeight: 500 }} size={'$lg'} color="$neutral">
            {additionalInfo?.likesAmount}
          </Text>
        </Row>
        <Row css={{ ai: 'center', gap: '$5' }}>
          <IconButton css={{ width: '2rem', height: '2rem' }}>
            <Icon iconUrl={commentIcon} size="1.75rem" />
          </IconButton>
          <Text css={{ fontWeight: 500 }} size={'$lg'} color="$neutral">
            {additionalInfo?.commentsAmount}
          </Text>
        </Row>
      </Row>

      <CommentsList listId={list.id} />

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
