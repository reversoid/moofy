import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Task } from './entities/task.entity';
import { AuthTaskService } from './services/auth.task.service';
import { ReviewTaskService } from './services/review.task.service';
import { ListTaskService } from './services/list.task.service';
import { ReviewModule } from '../review/review.module';
import { ListModule } from '../list/list.module';
import { TaskRepository } from './repositories/task.repository';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Task]),
    UserModule,
    ReviewModule,
    ListModule,
  ],
  providers: [
    AuthTaskService,
    ReviewTaskService,
    ListTaskService,
    TaskRepository,
  ],
})
export class TaskModule {}
