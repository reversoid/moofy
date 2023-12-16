import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { User } from 'src/modules/user/models/user';
import { z } from 'zod';
import { ProfileNotificationsService } from '../profile-notifications.service';
import { UnauthorizedException } from 'src/modules/auth/exceptions/unauthorized.exception';

const notificationIdSchema = z.string().uuid();

@Injectable()
export class UserCanAccessNotificationGuard implements CanActivate {
  constructor(private readonly moduleRef: ModuleRef) {}

  profileNotificationService = this.moduleRef.get(ProfileNotificationsService, {
    strict: false,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User | null = request['user'];

    if (!user) {
      throw new UnauthorizedException();
    }

    const id = notificationIdSchema.parse(request.params['id']);

    const notification =
      await this.profileNotificationService.getNotificationById(id);

    if (!notification) {
      throw new NotFoundException();
    }

    return notification.toUser.id === user.id;
  }
}
