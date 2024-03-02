import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Film, PaginatedData } from '../../shared/types';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  constructor(private readonly http: HttpClient) {}

  searchFilms(name: string, limit: number = 20) {
    return this.http
      .get<PaginatedData<Film>>('films', { params: { search: name } })
      .pipe(map((v) => ({ ...v, items: v.items.slice(0, limit) })));
  }
}
