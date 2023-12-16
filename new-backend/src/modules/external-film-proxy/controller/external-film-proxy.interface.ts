import { SearchFilmsResponse } from './responses/search-films.response';

export interface IExternalFilmProxyController {
  searchFilms: (...args: any[]) => Promise<SearchFilmsResponse>;
}
