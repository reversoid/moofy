import { ToWatch } from 'src/modules/film/entities/toWatch.entity';
import { FavoriteList } from 'src/modules/list/entities/favoriteList.entity';
import { List } from 'src/modules/list/entities/list.entity';
import { Review } from 'src/modules/review/entities/review.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 32, nullable: false, unique: true })
  username: string;

  @Column('varchar', { length: 256, nullable: true, unique: true })
  email: string;

  @Column('varchar', { length: 400, nullable: true })
  description: string;

  @Column('varchar', { length: 120, nullable: true })
  image_url: string;

  @Column('char', { length: 60, nullable: false, select: false })
  password_hash: string;

  @OneToMany(() => List, (listEntity) => listEntity.user)
  lists: List[];

  @OneToMany(() => FavoriteList, (entity) => entity.user)
  favorite_lists: FavoriteList[];

  @OneToMany(() => Review, (reviewEntity) => reviewEntity.user)
  reviews: Review[];

  @OneToMany(() => ToWatch, (toWatch) => toWatch.user)
  toWatch: ToWatch[];

  @Index()
  @CreateDateColumn({ type: 'timestamptz', select: false })
  created_at: Date;

  @Index()
  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updated_at: Date;

  @Index()
  @DeleteDateColumn({ select: false, type: 'timestamptz' })
  deleted_at: Date;

  /** Is used for full text search */
  @Column({ type: 'tsvector', select: false })
  @Index()
  username_search_document: any;

  @OneToMany(() => Subscription, (subscription) => subscription.follower)
  followedSubscriptions: Subscription[];

  @OneToMany(() => Subscription, (subscription) => subscription.followed)
  followerSubscriptions: Subscription[];
}
