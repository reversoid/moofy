import { ExecutionContext, OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RMQRoute } from 'nestjs-rmq';
import { Server, Socket } from 'socket.io';
import { WsGuard } from './guards/ws-guard';
import { SocketService } from './utils/socket.service';
import { ProfileNotificationsService } from './profile-notifications.service';
import { ProfileDirectNotification } from './models/notifications/profile-direct-notification';
import { ProfileCounterNotification } from './models/notifications/profile-counter-notification';
import { ProfileSeenNotification } from './models/notifications/profile-seen-notification';
import {
  PROFILE_COUNTER_NOTIFICATION_TOPIC,
  PROFILE_DIRECT_NOTIFICATION_TOPIC,
  PROFILE_SEEN_ALL_NOTIFICATIONS_TOPIC,
  PROFILE_SEEN_NOTIFICATION_TOPIC,
} from './utils/topics';
import { ProfileNotification } from './models/profile-notification';
import { User } from '../user/models/user';

@WebSocketGateway()
export class ProfileNotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    private readonly profileEventsService: ProfileNotificationsService,
    private readonly socketService: SocketService,
    private readonly wsGuard: WsGuard,
  ) {}

  async onModuleInit() {
    await this.socketService.clearAllSocketIds();
  }

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket & { userId: number }) {
    const context = this.createWsExecutionContext(client);
    const canActivate = await this.wsGuard.canActivate(context);

    if (!canActivate) {
      client.disconnect();
      return;
    }

    await this.socketService.saveUserSocketID(client['userId'], client.id);
  }

  async handleDisconnect(client: Socket & { userId?: number }) {
    const userId = client['userId'];
    if (userId) {
      await this.socketService.removeUserSocketID(userId, client.id);
    }
  }

  @RMQRoute(PROFILE_DIRECT_NOTIFICATION_TOPIC)
  async handleNewNotification(notification: ProfileNotification) {
    const directNotification =
      await this.profileEventsService.getDirectNotification(notification);

    if (!directNotification) {
      return;
    }

    return await this.sendDirectNotificationToUser(
      notification.toUser.id,
      directNotification,
    );
  }

  @RMQRoute(PROFILE_SEEN_NOTIFICATION_TOPIC)
  async handleSeenNotification(notification: ProfileNotification) {
    return await this.sendSeenNotificationToUser(notification.toUser.id, {
      notificationId: notification.id,
    });
  }

  @RMQRoute(PROFILE_SEEN_ALL_NOTIFICATIONS_TOPIC)
  async handleSeenAllNotifications({ userId }: { userId: User['id'] }) {
    return await this.sendSeenNotificationToUser(userId, {
      notificationId: '__ALL__',
    });
  }

  @RMQRoute(PROFILE_COUNTER_NOTIFICATION_TOPIC)
  async handleCounterNotification(notification: ProfileNotification) {
    return await this.sendCounterNotificationToUser(notification.toUser.id, {
      eventId: notification.id,
    });
  }

  private async sendDirectNotificationToUser(
    userId: number,
    event: ProfileDirectNotification,
  ) {
    return this.sendNotificationToUser('notification:direct', userId, event);
  }

  private async sendSeenNotificationToUser(
    userId: number,
    notification: ProfileSeenNotification,
  ) {
    return this.sendNotificationToUser(
      'notification:seen',
      userId,
      notification,
    );
  }

  private async sendCounterNotificationToUser(
    userId: number,
    event: ProfileCounterNotification,
  ) {
    return this.sendNotificationToUser('notification:counter', userId, event);
  }

  private async sendNotificationToUser(
    eventName: string,
    userId: number,
    event: unknown,
  ) {
    const ids = await this.socketService.getUserSocketIDs(userId);
    for (const id of ids) {
      const client = this.server.sockets.sockets.get(id);
      client?.emit(eventName, event);
    }
  }

  private createWsExecutionContext(client: Socket): ExecutionContext {
    return {
      switchToWs: () => ({ getClient: () => client }),
      getType: () => 'ws',
    } as ExecutionContext;
  }
}
