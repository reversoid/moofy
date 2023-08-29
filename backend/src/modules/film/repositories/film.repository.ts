import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Film } from '../entities/film.entity';

@Injectable()
export class FilmRepository extends Repository<Film> {
  constructor(dataSource: DataSource) {
    super(Film, dataSource.createEntityManager());
  }

  async getFilmById(id: string) {
    return this.findOne({
      where: {
        id,
      },
    });
  }

  async getFilmsByIds(ids: string[]) {
    return this.find({
      where: {
        id: In(ids),
      },
    });
  }

  async saveFilm(film: Film) {
    const result = await this.save(film);

    return { id: result.id as string };
  }
}
