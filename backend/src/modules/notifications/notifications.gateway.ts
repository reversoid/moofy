import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({ path: 'notifications' })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  handleConnection(client: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }
}
