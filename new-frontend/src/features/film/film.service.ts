import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Film, PaginatedData } from '../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  constructor(private readonly http: HttpClient) {}

  searchFilms(name: string) {
    return this.http.get<PaginatedData<Film>>('films', { params: { search: name } });
  }
}
