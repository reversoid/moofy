import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum EventType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  LIKE_TO_COMMENT = 'LIKE_TO_COMMENT',
  SUBSCRIBE = 'SUBSCRIBE',
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: true })
  user_from_id?: number;

  @Index()
  @Column({ type: 'int', nullable: false })
  user_to_id: number;

  @Column({ type: 'int', nullable: true })
  target_id?: number;

  @Column({ type: 'enum', nullable: false, enum: EventType })
  type: EventType;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true, select: false })
  deleted_at?: Date;

  @Index()
  @Column({ type: 'timestamptz', nullable: true })
  seen_at?: Date;
}
