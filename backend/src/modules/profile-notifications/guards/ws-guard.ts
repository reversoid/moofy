import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ValidationService } from 'src/modules/auth/utils/validation.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private readonly validationService: ValidationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token: string | undefined = client.handshake?.query?.token;

    if (!token) {
      return false;
    }

    const userId = await this.validateAccessToken(token);

    if (!userId) {
      return false;
    }

    client['userId'] = userId;

    return true;
  }

  async validateAccessToken(token: string): Promise<number | null> {
    try {
      const { id } = await this.validationService.validateAccessToken(token);
      return id;
    } catch {
      return null;
    }
  }
}
