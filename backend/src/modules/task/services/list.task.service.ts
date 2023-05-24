import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/modules/list/entities/list.entity';
import { Repository } from 'typeorm';
import { EVERY_NTH_DAY_IN_MONTH_AT_5_AM } from '../cron.constants';
import { Task, TaskType } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';
import { TaskService } from './task.service';

@Injectable()
export class ListTaskService
  extends TaskService
  implements OnApplicationBootstrap
{
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    taskRepository: TaskRepository,
  ) {
    super(taskRepository);
  }

  async onApplicationBootstrap() {
    const tasksToFinish = await super.getUnfinishedTasks(TaskType.LIST);

    tasksToFinish.forEach((task) => {
      switch (task.task_name) {
        case 'cleanDeletedLists':
          this.cleanDeletedLists(task);
          break;

        default:
          this.taskRepository.deleteTaskById(task.id);
      }
    });
  }

  @Cron(EVERY_NTH_DAY_IN_MONTH_AT_5_AM(2))
  async cleanDeletedLists(existingTask?: Task) {
    super.runTask(
      TaskType.LIST,
      'cleanDeletedLists',
      existingTask,
      async () => {
        this.listRepository
          .createQueryBuilder('list')
          .delete()
          .from(List)
          .where('"list"."deleted_at" IS NOT NULL')
          .execute();
      },
    );
  }
}
