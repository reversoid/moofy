import ApiService from '@/shared/api/api.service';

type DateAsString = string;

export interface List {
  id: number;
  name: string;
  description: string;
  is_public: boolean;
  created_at: DateAsString;
  updated_at: DateAsString;
}

export interface IterableResponse<T> {
  /**Represents a date */
  nextKey: DateAsString | null;
  items: T[];
}

export class ListService extends ApiService {
  public async getMyLists() {
    return this.get<IterableResponse<List>>('/list', { useJWT: true });
  }
}

export const listService = new ListService()
