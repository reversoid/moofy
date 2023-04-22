import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { FC } from 'react';
import { ButtonProps } from '@nextui-org/react';
import BookmarkIcon from '@/shared/Icons/Bookmark.icon';

interface BookmarkButtonProps extends ButtonProps {
  iconFilled?: boolean;
}

const BookmarkButton: FC<BookmarkButtonProps> = ({ iconFilled, ...props }) => (
  <IconButton {...props}>
    <BookmarkIcon
      size="1.75rem"
      iconFilled={iconFilled}
    />
  </IconButton>
);

export default BookmarkButton;
