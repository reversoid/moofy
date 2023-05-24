import { Injectable } from '@nestjs/common';
import { DataSource, LessThanOrEqual, Repository } from 'typeorm';
import { Task, TaskType } from '../entities/task.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTaskByName(name: string) {
    return this.findOne({
      where: {
        task_name: name,
      },
    });
  }

  async saveTaskAndReturnId(task: Task): Promise<number> {
    return (
      await this.createQueryBuilder()
        .insert()
        .into(Task)
        .values(task)
        .returning('id')
        .execute()
    ).raw[0].id;
  }

  async deleteTaskById(id: number) {
    return this.delete({
      id,
    });
  }

  async getUnfinishedTasks(type: TaskType) {
    return this.find({
      where: {
        task_type: type,
        task_date: LessThanOrEqual(new Date()),
      },
    });
  }
}
