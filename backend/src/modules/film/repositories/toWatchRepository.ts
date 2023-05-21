import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ToWatch } from '../entities/toWatch.entity';

@Injectable()
export class ToWatchRepository extends Repository<ToWatch> {
  constructor(private dataSource: DataSource) {
    super(ToWatch, dataSource.createEntityManager());
  }
}
