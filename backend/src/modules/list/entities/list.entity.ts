import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Review } from 'src/modules/review/entities/review.entity';
import { FavoriteList } from './favoriteList.entity';

@Entity()
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.lists, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @Index()
  @Column('varchar', { length: 32, nullable: false })
  name: string;

  @Column('varchar', { length: 400, nullable: true })
  description: string;

  @Column('boolean', { default: false, nullable: false })
  is_public: boolean;

  @Column('boolean', { default: false, nullable: false })
  show_rating: boolean;

  @Column('boolean', { default: true, nullable: false })
  show_description: boolean;

  @Column('varchar', { length: 120, nullable: true })
  image_url: string;

  @OneToMany(() => Review, (reviewEntity) => reviewEntity.list)
  reviews: Review[];

  @OneToMany(() => FavoriteList, (entity) => entity.list)
  favorite_lists: FavoriteList[];

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Index()
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Index()
  @DeleteDateColumn({ select: false, type: 'timestamptz' })
  deleted_at: Date;

  /** Is used for full text search */
  @Column({ type: 'tsvector', select: false })
  @Index()
  search_document: any;
}
