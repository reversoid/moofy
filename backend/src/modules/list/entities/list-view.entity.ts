import { User } from 'src/modules/user/entities/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { List } from './list.entity';

@Entity()
export class ListView {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.list_views, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => List, (list) => list.views, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  list: List;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @DeleteDateColumn({ select: false, type: 'timestamptz' })
  deleted_at: Date;
}
