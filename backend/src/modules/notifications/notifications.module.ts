import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { EventRepository } from './repositories/event.repository';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [NotificationsController],
  providers: [NotificationsService, EventRepository, NotificationsGateway],
})
export class NotificationsModule {}
