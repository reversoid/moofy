import ApiService from '@/app/api/api.service';
import { Film } from '@/shared/api/types/film.type';

export class FilmService extends ApiService {
  public async getFilmsByName(filmName: string, signal?: AbortSignal) {
    return this.get<{ items: Film[] }>('/search-films', {
      searchParams: {
        filmName,
        limit: 5,
      },
      signal,
    });
  }
}

export const filmService = new FilmService();
