import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/modules/review/entities/review.entity';
import { Repository } from 'typeorm';
import { EVERY_NTH_DAY_IN_MONTH_AT_5_AM } from '../cron.constants';
import { Task, TaskType } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';
import { TaskService } from './task.service';

@Injectable()
export class ReviewTaskService
  extends TaskService
  implements OnApplicationBootstrap
{
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    taskRepository: TaskRepository,
  ) {
    super(taskRepository);
  }

  async onApplicationBootstrap() {
    const tasksToFinish = await super.getUnfinishedTasks(TaskType.REVIEW);

    tasksToFinish.forEach((task) => {
      switch (task.task_name) {
        case 'cleanDeletedReviews':
          this.cleanDeletedReviews(task);
          break;

        default:
          this.taskRepository.deleteTaskById(task.id);
      }
    });
  }

  @Cron(EVERY_NTH_DAY_IN_MONTH_AT_5_AM(3))
  async cleanDeletedReviews(existingTask?: Task) {
    super.runTask(
      TaskType.REVIEW,
      'cleanDeletedReviews',
      existingTask,
      async () => {
        this.reviewRepository
          .createQueryBuilder('review')
          .delete()
          .from(Review)
          .where('"review"."deleted_at" IS NOT NULL')
          .execute();
      },
    );
  }
}
