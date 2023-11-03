import { ExecutionContext } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RMQRoute } from 'nestjs-rmq';
import { Server, Socket } from 'socket.io';
import { Event } from './entities/event.entity';
import { WsGuard } from './guards/ws-guard';
import { NotificationsService } from './notifications.service';
import { CreateEventDTO, USER_NOTIFICATION_TOPIC } from './utils/event.service';
import { SocketService } from './utils/socket.service';

@WebSocketGateway({ path: 'notifications' })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly notificationService: NotificationsService,
    private readonly socketService: SocketService,
    private readonly wsGuard: WsGuard,
  ) {}

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

  @RMQRoute(USER_NOTIFICATION_TOPIC)
  async handleUserEventNotification(message: CreateEventDTO) {
    const event = await this.notificationService.createEvent(message);
    await this.sendEventToUsers(message.toUserId, event);
  }

  private async sendEventToUsers(userId: number, event: Event) {
    const ids = await this.socketService.getUserSocketIDs(userId);
    for (const id of ids) {
      const client = this.server.sockets.sockets.get(id);
      client?.emit('notification', event);
    }
  }

  private createWsExecutionContext(client: Socket): ExecutionContext {
    return {
      switchToWs: () => ({ getClient: () => client }),
      getType: () => 'ws',
    } as ExecutionContext;
  }
}
