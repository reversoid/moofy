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
import {
  PROFILE_NOTIFICATION_SEEN_TOPIC,
  PROFILE_NOTIFICATION_TOPIC,
} from '../events/utils/profile-events/topics';
import {
  ProfileEventDto,
  ProfileSeenEventDto,
} from '../events/utils/profile-events/types';
import { ProfileDirectNotification } from './models/notifications/profile-direct-notification';
import { ProfileCounterNotification } from './models/notifications/profile-counter-notification';
import { ProfileSeenNotification } from './models/notifications/profile-seen-notification';

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

  @RMQRoute(PROFILE_NOTIFICATION_TOPIC)
  async handleUserEventNotification(message: ProfileEventDto) {
    if (message.type === 'direct') {
      const directEvent = await this.profileEventsService.createNotification(
        message,
      );
      const notification =
        await this.profileEventsService.getDirectNotification(directEvent.id);

      if (!notification) {
        return;
      }

      return await this.sendDirectNotificationToUser(
        directEvent.user_to_id,
        notification,
      );
    }

    if (message.type === 'counter') {
      const counterEvents =
        await this.profileEventsService.findNotificationByEventId(message);

      return await this.sendCounterEventToUser(message.toUserId, {
        eventIds: counterEvents.map((e) => e.id),
      });
    }
  }

  @RMQRoute(PROFILE_NOTIFICATION_SEEN_TOPIC)
  async handleUserSeenEventNotification({
    eventId,
    toUserId,
  }: ProfileSeenEventDto) {
    return await this.sendSeenEventToUser(toUserId, { eventId });
  }

  private async sendDirectNotificationToUser(
    userId: number,
    event: ProfileDirectNotification,
  ) {
    return this.sendEventToUser('notification:direct', userId, event);
  }

  private async sendCounterEventToUser(
    userId: number,
    event: ProfileCounterNotification,
  ) {
    return this.sendEventToUser('notification:counter', userId, event);
  }

  private async sendSeenEventToUser(
    userId: number,
    event: ProfileSeenNotification,
  ) {
    return this.sendEventToUser('notification:seen', userId, event);
  }

  private async sendEventToUser(
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
