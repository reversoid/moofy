import ApiService from '@/shared/api/api.service';

export type DateAsString = string;

export interface List {
  id: number;
  name: string;
  description: string;
  is_public: boolean;
  created_at: DateAsString;
  updated_at: DateAsString;
}

export enum FilmType {
  FILM = 'FILM',
  TV_SERIES = 'TV_SERIES',
  TV_SHOW = 'TV_SHOW',
  MINI_SERIES = 'MINI_SERIES',
}

export interface Film {
  id: string;
  name: string;
  year: number;
  type: FilmType;
  filmLength: string;
  posterPreviewUrl: string;
  posterUrl: string;
  genres: string[];
}

export interface Review {
  id: number;
  film: Film;
  score: number;
  description: string;
  tags?: string[];
  created_at: Date;
  updated_at: Date;
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
}

export const listService = new ListService();
