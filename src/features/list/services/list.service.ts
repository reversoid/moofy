import ApiService from '@/shared/api/api.service';
import { List } from '@/shared/api/types/list.type';
import { Review } from '@/shared/api/types/review.type';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { SearchParamsOption } from 'ky';

export interface CreateListDTO {
  name: string;
  description: string;
  isPublic: boolean;
}

export interface UpdateListDTO extends Partial<CreateListDTO> {
  listId: number;
}

export interface DeleteListDTO {
  listId: number;
}

export class ListService extends ApiService {
  public async getMyLists(lowerBound?: DateAsString) {
    const searchParams: SearchParamsOption = {
      limit: 19,
    };
    if (lowerBound) {
      searchParams['lowerBound'] = lowerBound;
    }
    return this.get<IterableResponse<List>>('/list', {
      useJWT: true,
      searchParams,
    });
  }

  public async getMyListWithContent(listId: number, lowerBound?: DateAsString) {
    const searchParams: SearchParamsOption = {
      listId,
    };
    if (lowerBound) {
      searchParams['lowerBound'] = lowerBound;
    }

    return this.get<{ reviews: IterableResponse<Review>; list: List }>(
      '/review',
      {
        useJWT: true,
        searchParams,
      },
    );
  }

  public async createList(dto: CreateListDTO) {
    return this.post<List>('/list', { useJWT: true, json: dto });
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
}

export const listService = new ListService();
