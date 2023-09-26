import ApiService from '@/shared/api/api.service';

export interface LikeUnlikeListDto {
  listId: number;
}

export class ListLikeService extends ApiService {
  likeList({ listId }: LikeUnlikeListDto) {
    return this.put<void>(`/list/${listId}/likes`, {
      useJWT: true,
    });
  }

  unlikeList({ listId }: LikeUnlikeListDto) {
    return this.delete<void>(`/list/${listId}/likes`, {
      useJWT: true,
    });
  }
}

export const listLikeService = new ListLikeService();
