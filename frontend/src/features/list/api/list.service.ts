import ApiService from '@/shared/api/api.service';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { List, ListWithAdditionalInfo } from '@/shared/api/types/list.type';
import { Review } from '@/shared/api/types/review.type';
import {
  DateAsString,
  IterableResponse,
  RankValue,
} from '@/shared/api/types/shared';
import { SearchParamsOption } from 'ky';

export interface CreateListDTO {
  name: string;
  description: string;
  isPublic: boolean;
  imageUrl?: string;
}

export interface UpdateListDTO extends Partial<CreateListDTO> {
  listId: number;
}

export interface DeleteListDTO {
  listId: number;
}

export interface AddToFavoritesDTO {
  listId: number;
}

export interface RemoveFromFavoritesDTO {
  listId: number;
}

export interface ListWithContentResponse extends ListWithAdditionalInfo {
  reviews: IterableResponse<Review>;
}

export class ListService extends ApiService {
  public async getMyLists(lowerBound?: DateAsString, limit = 20) {
    const searchParams: SearchParamsOption = {
      limit,
    };
    if (lowerBound) {
      searchParams['lowerBound'] = lowerBound;
    }
    return this.get<IterableResponse<ListWithAdditionalInfo>>('/list', {
      useJWT: true,
      searchParams,
    });
  }

  /** Gets public lists for user */
  public async getUserLists(
    userId: number,
    lowerBound?: DateAsString,
    limit = 20,
  ) {
    const searchParams: SearchParamsOption = {
      limit,
      user: userId,
    };
    if (lowerBound) {
      searchParams['lowerBound'] = lowerBound;
    }
    return this.get<IterableResponse<ListWithAdditionalInfo>>('/list/public', {
      useJWT: true,
      searchParams,
    });
  }

  public async getMyListWithContent(
    listId: number,
    lowerBound?: DateAsString | RankValue,
    search?: string,
  ) {
    const searchParams: SearchParamsOption = {
      listId,
    };
    if (lowerBound) {
      searchParams['lowerBound'] = lowerBound;
    }
    if (search) {
      searchParams['search'] = search;
    }

    searchParams['limit'] = 20;

    return this.get<ListWithContentResponse>('/review', {
      useJWT: true,
      searchParams,
    });
  }

  public async createList(dto: CreateListDTO) {
    return this.post<List>('/list', { useJWT: true, json: dto });
  }

  public async markListAsViewed(id: number) {
    return this.post<List>(`/list/${id}/views`, { useJWT: true });
  }

  public async updateList(dto: UpdateListDTO) {
    return this.patch<List>('/list', { useJWT: true, json: dto });
  }

  public async deleteList(listId: number) {
    return this.delete<{ listId: number }>('/list', {
      useJWT: true,
      json: { listId },
    });
  }

  public async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.post<{ link: string }>('/list/image-upload', {
      useJWT: true,
      body: formData,
    });
  }

  public async addToFavorites({ listId }: AddToFavoritesDTO) {
    return this.post<FavoriteList>('/list/favorites', {
      useJWT: true,
      json: { listId },
    });
  }

  public async removeFromFavorites({ listId }: RemoveFromFavoritesDTO) {
    return this.delete<{ listId: number }>('/list/favorites', {
      useJWT: true,
      json: { listId },
    });
  }

  public async getFavoritesLists(lowerBound?: DateAsString) {
    // TODO maybe create createParams function?
    const searchParams: SearchParamsOption = {};
    if (lowerBound) {
      searchParams['lowerBound'] = lowerBound;
    }

    return this.get<IterableResponse<FavoriteList>>('/list/favorites', {
      useJWT: true,
      searchParams,
    });
  }

  public async getUpdates(lowerBound?: DateAsString) {
    const searchParams: SearchParamsOption = {};
    if (lowerBound) {
      searchParams['lowerBound'] = lowerBound;
    }

    return this.get<IterableResponse<ListWithAdditionalInfo>>('/list/updates', {
      useJWT: true,
      searchParams,
    });
  }

  public async getUpdatesAmount() {
    return this.get<{ updatesAmount: number }>('/list/updates/amount', {
      useJWT: true,
    });
  }
}

export const listService = new ListService();
