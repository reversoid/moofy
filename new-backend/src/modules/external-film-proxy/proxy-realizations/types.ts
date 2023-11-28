import { Film } from 'src/modules/film/models/film';

export interface ExternalFilmApiService {
  getFilmById(id: string): Promise<Film | null>;
  searchFilmsByName(name: string): Promise<Film[]>;
}
