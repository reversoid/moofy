import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum TaskType {
  AUTH = 'AUTH',
  REVIEW = 'REVIEW',
  LIST = 'LIST',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'timestamptz' })
  task_date: Date;

  @Index()
  @Column({
    type: 'enum',
    enum: TaskType,
    nullable: false,
  })
  task_type: TaskType;

  @Index({ unique: true })
  @Column('varchar', { length: 32 })
  task_name: string;
}
