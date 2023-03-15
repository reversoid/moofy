import { IconButton } from '@/shared/ui/IconButton';
import { forwardRef, useState } from 'react';
import { ButtonProps, Image } from '@nextui-org/react';
import bookmark from '@/assets/img/bookmark.svg';
import BookmarkIcon from '@/shared/JsIcons/Bookmark.icon';

// TODO maybe make icon button more declarative? with src, width and height props
const BookmarkButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const [filled, setFilled] = useState(false);

    return (
      <IconButton
        onClick={() => setFilled(v => !v)}
        ref={ref}
        {...{ css: { width: '1.75rem', height: '1.75rem' }, ...props }}
      >
        <BookmarkIcon width="1.75rem" height="1.75rem" filled={filled} />
      </IconButton>
    );
  },
);

export default BookmarkButton;
