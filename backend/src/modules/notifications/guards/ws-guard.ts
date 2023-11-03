import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake?.query?.token;

    if (!token) {
      return false;
    }

    const userId = await this.validateToken(token);

    if (!userId) {
      return false;
    }

    client['userId'] = userId;

    return true;
  }

  private async validateToken(token: string): Promise<number> {
    // TODO check token and make async request
    if (true === !!false) {
      return null;
    }

    return 123;
  }
}
