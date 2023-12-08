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
import {
  PROFILE_COUNTER_NOTIFICATION_TOPIC,
  PROFILE_DIRECT_NOTIFICATION_TOPIC,
  PROFILE_SEEN_ALL_NOTIFICATIONS_TOPIC,
  PROFILE_SEEN_NOTIFICATION_TOPIC,
} from '../utils/topics';

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
  async markAllNotificationsAsSeen(@AuthUser() user: User) {
    await this.notificationsService.markAllNotificationsAsSeen(user.id);
    await this.rmqService.notify(PROFILE_SEEN_ALL_NOTIFICATIONS_TOPIC, {
      userId: user.id,
    });
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
    const notification =
      await this.notificationsService.markNotificationAsSeen(eventId);

    this.rmqService.notify(PROFILE_SEEN_NOTIFICATION_TOPIC, notification);
  }

  @RMQRoute(CREATE_USER_EVENT_TOPIC)
  async createNotification(message: UserEvent) {
    const notification =
      await this.notificationsService.createNotification(message);

    this.rmqService.notify(PROFILE_DIRECT_NOTIFICATION_TOPIC, notification);
  }

  @RMQRoute(CANCEL_USER_EVENT_TOPIC)
  async cancelNotification(message: UserEvent) {
    const notification =
      await this.notificationsService.findNotificationByEventId(message.id);

    this.rmqService.notify(PROFILE_COUNTER_NOTIFICATION_TOPIC, notification);
  }
}
