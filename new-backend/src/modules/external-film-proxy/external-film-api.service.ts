import { Injectable } from '@nestjs/common';
import { UnnoficialKpService } from './proxy-realizations/unofficial-kp/unnoficial-kp.service';
import { Film } from '../film/models/film';

@Injectable()
export class ExternalFilmApiService {
  constructor(private readonly externalFilmApiService: UnnoficialKpService) {}

  searchFilmsByName(name: string): Promise<Film[]> {
    return this.externalFilmApiService.searchFilmsByName(name);
  }

  getFilmById(id: string): Promise<Film | null> {
    return this.externalFilmApiService.getFilmById(id);
  }
}
