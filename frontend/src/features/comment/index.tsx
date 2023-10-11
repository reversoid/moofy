import { Heart } from '@/shared/ui/Heart';
import { FC } from 'react';
import { useLikeComment } from './utils/useLikeComment';
import { useUnlikeComment } from './utils/useUnlikeComment';
import { CSS } from '@nextui-org/react';

export * from './utils/useLikeComment';
export * from './utils/useUnlikeComment';
export * from './model';
export * from './ui/CommentButton';

export interface CommentLikeProps {
  commentId: number;
  listId: number;
  liked: boolean;
  css?: CSS;
}

export const CommentLike: FC<CommentLikeProps> = ({
  listId,
  commentId,
  liked,
  css,
}) => {
  const likeMutation = useLikeComment();
  const unlikeMutation = useUnlikeComment();

  const loading = likeMutation.isLoading || unlikeMutation.isLoading;

  return (
    <Heart
      isBlack={true}
      liked={liked}
      loading={loading}
      onChange={(liked) => {
        if (liked) {
          likeMutation.mutate({ commentId, listId });
        } else {
          unlikeMutation.mutate({ commentId, listId });
        }
      }}
      css={css}
    />
  );
};
