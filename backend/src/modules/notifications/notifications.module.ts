import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { EventRepository } from './repositories/event.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [NotificationsController],
  providers: [NotificationsService, EventRepository],
})
export class NotificationsModule {}
