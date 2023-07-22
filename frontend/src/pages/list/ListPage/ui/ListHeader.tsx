import { HEADING_STYLES } from '@/app/providers/UIProvider/headingStyles';
import BookmarkButton from '@/features/list/favorite-lists/ui/BookmarkButton';
import ListOwnerActions from '@/features/list/list-owner-actions/ui/ListOwnerActions';
import { useAuth } from '@/app';
import { Row, Text } from '@nextui-org/react';
import { FC } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useFavoritesMutations as useFavoritesMutations } from '../lib/hooks/useFavoritesMutations';

interface ListHeaderProps {
  listName: string;
  isUserOwner: boolean;
  isFavorite: boolean;
  onClickUpdate: () => void;
  onClickDelete: () => void;
  listId: number;
}

export const ListHeader: FC<ListHeaderProps> = ({
  isFavorite,
  isUserOwner,
  listName,
  onClickDelete,
  onClickUpdate,
  listId,
}) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const {addToFavMutation, removeFromFavMutation} = useFavoritesMutations();

  return (
    <Row
      align="center"
      css={{
        gap: '$10',
        justifyContent: 'space-between',
        ...HEADING_STYLES.h1,
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
        {listName}
      </Text>

      {isUserOwner ? (
        <ListOwnerActions
          onClickUpdate={onClickUpdate}
          onClickDelete={onClickDelete}
        />
      ) : (
        <BookmarkButton
          onClick={() => {
            if (isLoggedIn === undefined) {
              return;
            }
            if (isLoggedIn === false) {
              return navigate({
                pathname: '/auth/login',
                search: `?${createSearchParams({ from: `/list/${listId}` })}`,
              });
            }
            return isFavorite
              ? removeFromFavMutation.mutate(listId)
              : addToFavMutation.mutate(listId);
          }}
          disabled={
            removeFromFavMutation.isLoading || addToFavMutation.isLoading
          }
          iconFilled={isFavorite}
        />
      )}
    </Row>
  );
};
