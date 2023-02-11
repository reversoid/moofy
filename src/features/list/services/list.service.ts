import ApiService from '@/shared/api/api.service';

export interface CreateListDTO {
  name: string;
  description: string;
  isPublic: boolean;
}

export interface UpdateListDTO extends Partial<CreateListDTO> {
  listId: number;
}

export class ListService extends ApiService {
  public async getMyLists() {
    return this.get<IterableResponse<List>>('/list', { useJWT: true });
  }

  public async getMyListWithContent(id: number) {
    return this.get<{ reviews: IterableResponse<Review>; list: List }>(
      '/review',
      {
        useJWT: true,
        searchParams: {
          listId: id,
        },
      },
    );
  }

  public async createList(dto: CreateListDTO) {
    return this.post<List>('/list', { useJWT: true, json: dto });
  }

  public async updateList(dto: UpdateListDTO) {
    return this.patch<List>('/list', { useJWT: true, json: dto });
  }
}

export const listService = new ListService();
