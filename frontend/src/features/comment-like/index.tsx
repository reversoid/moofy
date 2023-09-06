import { Heart } from '@/shared/ui/Heart';
import { FC } from 'react';
import { useLikeComment } from './utils/useLikeComment';
import { useUnlikeComment } from './utils/useUnlikeComment';

export * from './utils/useLikeComment';
export * from './model';

export interface CommentLikeProps {
  commentId: number;
  listId: number;
  liked: boolean;
}

export const CommentLike: FC<CommentLikeProps> = ({
  listId,
  commentId,
  liked,
}) => {
  const likeMutation = useLikeComment();
  const unlikeMutation = useUnlikeComment();

  const loading = likeMutation.isLoading || unlikeMutation.isLoading;

  return (
    <Heart
      liked={liked}
      loading={loading}
      onChange={(liked) => {
        if (liked) {
          likeMutation.mutate({ commentId, listId });
        } else {
          unlikeMutation.mutate({ commentId, listId });
        }
      }}
    />
  );
};
