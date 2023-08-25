import { Review } from 'src/modules/review/entities/review.entity';
import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { ToWatch } from './toWatch.entity';

export enum FilmType {
  FILM = 'FILM',
  TV_SERIES = 'TV_SERIES',
  TV_SHOW = 'TV_SHOW',
  MINI_SERIES = 'MINI_SERIES',
  VIDEO = 'VIDEO',
}

@Entity()
export class Film {
  @PrimaryColumn({
    unique: true,
    type: 'varchar',
    length: '32',
    nullable: false,
  })
  id: string;

  @Index()
  @Column('varchar', { length: 128, nullable: false })
  name: string;

  @Index()
  @Column('smallint', { nullable: false })
  year: number;

  @Index()
  @Column({ type: 'enum', nullable: false, enum: FilmType })
  type: FilmType;

  @Index()
  @Column('char', { length: 6, nullable: true })
  filmLength: string;

  @Column('varchar', { length: 120, nullable: true })
  posterPreviewUrl: string;

  @Column('varchar', { length: 120, nullable: true })
  posterUrl: string;

  @Index()
  @Column('varchar', { length: 32, array: true, nullable: true })
  genres: string[];

  @OneToMany(() => Review, (reviewEntity) => reviewEntity.film)
  reviews: Review[];

  @OneToMany(() => ToWatch, (toWatch) => toWatch.film)
  toWatch: ToWatch[];

  /** Is used for full text search */
  @Column({ type: 'tsvector', select: false })
  @Index()
  search_document: any;
}
