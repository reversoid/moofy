import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserCanAccessEventGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // TODO make some calculations
    return true;
  }
}
