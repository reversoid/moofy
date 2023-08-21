import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Film } from '../entities/film.entity';

@Injectable()
export class FilmRepository extends Repository<Film> {
  constructor(private dataSource: DataSource) {
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
    const insertResult = await this.createQueryBuilder('film')
      .insert()
      .into(Film)
      .values([film])
      .returning(['id'])
      .execute();

    return { id: insertResult.raw[0].id as string };
  }
}
