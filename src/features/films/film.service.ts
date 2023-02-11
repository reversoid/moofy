import ApiService from '@/shared/api/api.service';
import { Film } from '../list/services/list.service';

export class FilmService extends ApiService {
  public async getFilmsByName(filmName: string) {
    return this.get<{ items: Film[] }>('/search-films', {
      searchParams: {
        filmName,
        limit: 5,
      },
    });
  }
}

export const filmService = new FilmService();
