import { Film } from '@/shared/api/types/film.type';

import ApiService, { apiService } from '@/app/api/api.service';

export async function getFilmById(filmId: string, signal?: AbortSignal) {
  return apiService.get<{ film: Film | null }>(`/film/${filmId}`, {
    signal,
  });
}
