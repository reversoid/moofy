import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { EventRepository } from './repositories/event.repository';
import { NotificationsGateway } from './notifications.gateway';
import { SocketService } from './utils/socket.service';
import { EventService } from './utils/event.service';
import { WsGuard } from './guards/ws-guard';
import { ValidationService } from '../auth/utils/validation.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    EventRepository,
    NotificationsGateway,
    SocketService,
    EventService,
    WsGuard,
    ValidationService,
    JwtService,
  ],
})
export class NotificationsModule {}
