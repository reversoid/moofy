import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { EVERY_NTH_DAY_IN_MONTH_AT_5_AM } from '../cron.constants';
import { Task, TaskType } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';
import { TaskService } from './task.service';

@Injectable()
export class AuthTaskService
  extends TaskService
  implements OnApplicationBootstrap
{
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    taskRepository: TaskRepository,
  ) {
    super(taskRepository);
  }

  async onApplicationBootstrap() {
    const tasksToFinish = await super.getUnfinishedTasks(TaskType.AUTH);

    tasksToFinish.forEach((task) => {
      switch (task.task_name) {
        case 'cleanDeletedUsers':
          this.cleanDeletedUsers(task);
          break;

        default:
          this.taskRepository.deleteTaskById(task.id);
      }
    });
  }

  @Cron(EVERY_NTH_DAY_IN_MONTH_AT_5_AM(1))
  async cleanDeletedUsers(existingTask?: Task) {
    super.runTask(
      TaskType.AUTH,
      'cleanDeletedUsers',
      existingTask,
      async () => {
        this.userRepository
          .createQueryBuilder('user')
          .delete()
          .from(User)
          .where('"user"."deleted_at" IS NOT NULL')
          .execute();
      },
    );
  }
}
