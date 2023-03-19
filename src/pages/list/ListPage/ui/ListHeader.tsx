import {
  addToFavorites,
  removeFromFavorites,
} from '@/features/list/favorite-lists';
import BookmarkButton from '@/features/list/favorite-lists/ui/BookmarkButton';
import ListOwnerActions from '@/features/list/list-owner-actions/ui/ListOwnerActions';
import { Row, Text } from '@nextui-org/react';
import React, { FC } from 'react';

interface ListHeaderProps {
  listName: string;
  isUserOwner: boolean;
  bookmarkButtonDisabled: boolean;
  isFavorite: boolean;
  onClickUpdate: () => void;
  onClickDelete: () => void;
  listId: number;
}

export const ListHeader: FC<ListHeaderProps> = ({
  bookmarkButtonDisabled,
  isFavorite,
  isUserOwner,
  listName,
  onClickDelete,
  onClickUpdate,
  listId,
}) => {
  return (
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
        {listName}
      </Text>

      {isUserOwner ? (
        <ListOwnerActions
          onClickUpdate={onClickUpdate}
          onClickDelete={onClickDelete}
        />
      ) : (
        <BookmarkButton
          onClick={() =>
            isFavorite
              ? removeFromFavorites({ listId })
              : addToFavorites({ listId })
          }
          disabled={bookmarkButtonDisabled}
          iconFilled={isFavorite}
        />
      )}
    </Row>
  );
};
