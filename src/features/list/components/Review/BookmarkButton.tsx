import { IconButton } from '@/shared/ui/IconButton';
import { FC, forwardRef } from 'react';
import { ButtonProps } from '@nextui-org/react';
import BookmarkIcon from '@/shared/JsIcons/Bookmark.icon';

interface BookmarkButtonProps extends ButtonProps {
  iconFilled?: boolean;
}

// TODO maybe make icon button more declarative? with src, width and height props
const BookmarkButton: FC<BookmarkButtonProps> = ({ iconFilled, ...props }) => (
  <IconButton css={{ width: '1.75rem', height: '1.75rem' }} {...props}>
    <BookmarkIcon
      width="1.75rem"
      height="1.75rem"
      iconFilled={iconFilled}
    />
  </IconButton>
);

export default BookmarkButton;
