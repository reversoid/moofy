import { ExecutionContext, OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RMQRoute } from 'nestjs-rmq';
import { Server, Socket } from 'socket.io';
import { PROFILE_NOTIFICATION_TOPIC } from '../event/utils/topics';
import { SendProfileEventDTO } from '../event/utils/types';
import { WsGuard } from './guards/ws-guard';
import { ProfileNotificationsService } from './profile-notifications.service';
import { SocketService } from './utils/socket.service';
import {
  ProfileCounterEventDTO,
  ProfileDirectEventDTO,
  ProfileSeenEventDto,
} from './utils/types';

@WebSocketGateway()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    private readonly notificationService: ProfileNotificationsService,
    private readonly socketService: SocketService,
    private readonly wsGuard: WsGuard,
  ) {}

  async onModuleInit() {
    await this.socketService.clearAllSocketIds();
  }

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const context = this.createWsExecutionContext(client);
    const canActivate = await this.wsGuard.canActivate(context);

    if (!canActivate) {
      client.disconnect();
      return;
    }

    await this.socketService.saveUserSocketID(client['userId'], client.id);
  }

  async handleDisconnect(client: Socket) {
    const userId = client['userId'];
    if (userId) {
      await this.socketService.removeUserSocketID(userId, client.id);
    }
  }

  @RMQRoute(PROFILE_NOTIFICATION_TOPIC)
  async handleUserEventNotification(message: SendProfileEventDTO) {
    if (message.type === 'direct') {
      const directEvent = await this.notificationService.createEvent(message);
      return await this.sendDirectEventToUser(message.toUserId, directEvent);
    }
    if (message.type === 'counter') {
      const counterEvent = await this.notificationService.removeEvents(message);
      return await this.sendCounterEventToUser(message.toUserId, counterEvent);
    }
    if (message.type === 'seen') {
      const seenEvent = await this.notificationService.markEventAsSeen(
        message.toUserId,
        message.eventId,
      );
      return await this.sendSeenEventToUser(message.toUserId, seenEvent);
    }
  }

  private async sendDirectEventToUser(
    userId: number,
    event: ProfileDirectEventDTO,
  ) {
    return this.sendEventToUser('notification:direct', userId, event);
  }

  private async sendCounterEventToUser(
    userId: number,
    event: ProfileCounterEventDTO,
  ) {
    return this.sendEventToUser('notification:counter', userId, event);
  }

  private async sendSeenEventToUser(
    userId: number,
    event: ProfileSeenEventDto,
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
