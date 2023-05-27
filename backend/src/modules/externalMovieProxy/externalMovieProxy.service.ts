import { Injectable } from '@nestjs/common';
import { UnofficialKpService } from './proxyRealizations/unofficial.kp.service';
import { Film } from '../film/entities/film.entity';

@Injectable()
export class ExternalMovieProxyService {
  constructor(private readonly kpService: UnofficialKpService) {}

  searchFilmsByName(name: string): Promise<Film[] | null> {
    return this.kpService.searchFilmsByName(name);
  }

  getFilmById(id: number): Promise<Film | null> {
    return this.kpService.getFilmById(id);
  }
}
