import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateProfileNotificationDto } from './dto/create-profile-notification-event.dto';

import { User } from 'src/modules/user/models/user';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import {
  ProfileNotification,
  selectProfileNotification,
} from './models/profile-notification';
import { UserEvent } from '../events/models/user-event';

@Injectable()
export class ProfileNotificationsRepository extends PaginatedRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async createNotification({
    eventId,
    fromUserId,
    toUserId,
  }: CreateProfileNotificationDto): Promise<ProfileNotification> {
    return this.prismaService.notification.create({
      data: {
        event_id: eventId,
        from_user_id: fromUserId,
        to_user_id: toUserId,
      },
      select: selectProfileNotification,
    });
  }

  async findNotificationByEventId(
    eventId: UserEvent['id'],
  ): Promise<ProfileNotification | null> {
    return this.prismaService.notification.findFirst({
      where: {
        event: {
          id: eventId,
        },
      },
      select: selectProfileNotification,
    });
  }

  async markNotificationAsSeen(
    notificationId: ProfileNotification['id'],
  ): Promise<ProfileNotification | null> {
    const notification = await this.findNotificationByEventId(notificationId);

    const seenDate = new Date();
    if (notification) {
      await this.prismaService.notification.update({
        where: {
          id: notification.id,
        },
        data: {
          seen_at: seenDate,
        },
      });
      return { ...notification, seen_at: seenDate };
    }

    return null;
  }

  async markAllNotificationsAsSeen(userId: User['id']) {
    await this.prismaService.notification.updateMany({
      where: {
        to_user_id: userId,
        seen_at: null,
      },
      data: {
        seen_at: new Date(),
      },
    });
  }

  async getUserNotifications(
    userId: User['id'],
    limit: number,
    type: 'all' | 'seen' | 'unseen',
    nextKey?: string,
  ): Promise<PaginatedData<ProfileNotification>> {
    const key = super.parseNextKey(nextKey);

    const seenAt = {
      all: undefined,
      seen: { not: null },
      unseen: null,
    };

    const notifications = await this.prismaService.notification.findMany({
      where: {
        to_user_id: userId,
        seen_at: seenAt[type],
        event: {
          created_at: key ? { lte: new Date(key) } : undefined,
          deleted_at: null,
        },
      },
      select: selectProfileNotification,
      take: limit + 1,
      orderBy: { event: { created_at: 'desc' } },
    });

    const events = notifications.map((n) => n.event);
    const paginatedEvents = super.getPaginatedData(events, limit, 'created_at');
    return {
      nextKey: paginatedEvents.nextKey,
      items: super.sliceItems(notifications, limit),
    };
  }

  async getAmountOfUnseenEvents(userId: User['id']): Promise<number> {
    return this.prismaService.notification.count({
      where: { seen_at: null, to_user_id: userId },
    });
  }

  async getNotificationById(
    notificationId: ProfileNotification['id'],
  ): Promise<ProfileNotification | null> {
    return this.prismaService.notification.findUnique({
      where: {
        id: notificationId,
      },
      select: selectProfileNotification,
    });
  }
}
