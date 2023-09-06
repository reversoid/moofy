import { Heart } from '@/shared/ui/Heart';
import { FC } from 'react';
import { useLikeList } from './utils/useLikeList';
import { useUnlikeList } from './utils/useUnlikeList';

export * from './utils/useLikeList';
export * from './model';

export interface ListLikeProps {
  listId: number;
  liked: boolean;
}

export const ListLike: FC<ListLikeProps> = ({ listId, liked }) => {
  const likeMutation = useLikeList();
  const unlikeMutation = useUnlikeList();

  const loading = likeMutation.isLoading || unlikeMutation.isLoading;

  return (
    <Heart
      liked={liked}
      loading={loading}
      onChange={(liked) => {
        if (liked) {
          likeMutation.mutate({ listId });
        } else {
          unlikeMutation.mutate({ listId });
        }
      }}
    />
  );
};
