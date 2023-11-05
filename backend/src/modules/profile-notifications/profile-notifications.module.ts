import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ListModule } from '../list/list.module';
import { UserModule } from '../user/user.module';
import { ProfileEvent } from './entities/profile-event.entity';
import { WsGuard } from './guards/ws-guard';
import { ProfileNotificationsController } from './profile-notifications.controller';
import { NotificationsGateway } from './profile-notifications.gateway';
import { ProfileNotificationsService } from './profile-notifications.service';
import { ProfileEventRepository } from './repositories/profile-event.repository';
import { SocketService } from './utils/socket.service';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileEvent]),
    AuthModule,
    UserModule,
    ListModule,
    EventModule,
  ],
  controllers: [ProfileNotificationsController],
  providers: [
    ProfileNotificationsService,
    ProfileEventRepository,
    NotificationsGateway,
    SocketService,
    WsGuard,
  ],
})
export class ProfileNotificationsModule {}
