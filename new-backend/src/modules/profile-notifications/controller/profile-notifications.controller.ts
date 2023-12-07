import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/passport/jwt-auth.guard';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { User } from '../../user/models/user';
import { PaginatedQueryDto } from 'src/shared/utils/pagination/paginated-query.dto';
import { ProfileNotificationsService } from '../profile-notifications.service';
import { UserCanAccessEventGuard } from '../guards/user-can-access-guard';
import { IProfileNotificationsController } from './interface';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { getEventsResponseSchema } from './responses/get-events.response';
import { getEventsAmountResponseSchema } from './responses/get-unseen-amount.response';
import { RMQRoute, RMQService } from 'nestjs-rmq';
import {
  CANCEL_USER_EVENT_TOPIC,
  CREATE_USER_EVENT_TOPIC,
} from 'src/modules/events/utils/topics';
import { UserEvent } from 'src/modules/events/models/user-event';

@Controller('profile-notifications')
export class ProfileNotificationsController
  implements IProfileNotificationsController
{
  constructor(
    private readonly notificationsService: ProfileNotificationsService,
    private readonly rmqService: RMQService,
  ) {}

  @Get('unseen')
  @UseGuards(JwtAuthGuard)
  @HttpResponse(getEventsResponseSchema)
  async getUnreadNotifications(
    @AuthUser() user: User,
    @Query() { limit, nextKey }: PaginatedQueryDto,
  ) {
    return this.notificationsService.getNotificationsForUser(
      user.id,
      limit ?? 20,
      'unseen',
      nextKey,
    );
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @HttpResponse(getEventsResponseSchema)
  async getAllNotifications(
    @AuthUser() user: User,
    @Query() { limit, nextKey }: PaginatedQueryDto,
  ) {
    return this.notificationsService.getNotificationsForUser(
      user.id,
      limit ?? 20,
      'all',
      nextKey,
    );
  }

  @Patch('unseen/all')
  @UseGuards(JwtAuthGuard)
  async markAlNotificationsAsSeen(@AuthUser() user: User) {
    return this.notificationsService.markAllNotificationsAsSeen(user.id);
  }

  @Get('unseen/amount')
  @UseGuards(JwtAuthGuard)
  @HttpResponse(getEventsAmountResponseSchema)
  async getUnseenAmount(@AuthUser() user: User) {
    const amount =
      await this.notificationsService.getAmountOfUnseenNotification(user.id);

    return { amount };
  }

  @Patch('unseen/:id')
  @UseGuards(JwtAuthGuard, UserCanAccessEventGuard)
  async markNotificationAsSeen(@Param('id', ParseUUIDPipe) eventId: string) {
    await this.notificationsService.markNotificationAsSeen(eventId);
  }

  @RMQRoute(CREATE_USER_EVENT_TOPIC)
  async createNotification(message: UserEvent) {
    await this.notificationsService.createNotification(message);
  }

  @RMQRoute(CANCEL_USER_EVENT_TOPIC)
  async cancelNotification(message: UserEvent) {
    await this.notificationsService.findNotificationByEventId(message);
  }
}
