import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateProfileEventDto } from './dto/create-profile-event.dto';
import { RemoveProfileEventDto } from './dto/remove-profile-event.dto';
import { ProfileEvent, selectProfileEvent } from './models/profile-event';
import { User } from 'src/modules/user/models/user';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';

@Injectable()
export class ProfileEventRepository extends PaginatedRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async createEvent({
    eventType,
    targetId,
    fromUser,
    toUserId,
  }: CreateProfileEventDto) {
    return this.prismaService.profile_event.create({
      data: {
        type: eventType,
        user_to_id: toUserId,
        created_at: new Date(),
        target_id: targetId,
        user_from_id: fromUser,
      },
      select: selectProfileEvent,
    });
  }

  async removeEvent({ eventType, targetId }: RemoveProfileEventDto) {
    const event = await this.prismaService.profile_event.findFirst({
      where: {
        type: eventType,
        target_id: targetId,
        deleted_at: null,
      },
      select: selectProfileEvent,
    });

    if (!event) {
      return null;
    }

    await this.prismaService.profile_event.updateMany({
      data: { deleted_at: new Date() },
      where: {
        id: event.id,
      },
    });

    return event;
  }

  async markEventAsSeen(eventId: ProfileEvent['id']) {
    const event = await this.getEvent(eventId);

    if (event) {
      await this.prismaService.profile_event.update({
        where: {
          id: event.id,
        },
        data: {
          seen_at: new Date(),
        },
      });
    }
    return event;
  }

  async markAllEventsAsSeen(userId: User['id']) {
    await this.prismaService.profile_event.updateMany({
      where: {
        user_to_id: userId,
        seen_at: null,
      },
      data: {
        seen_at: new Date(),
      },
    });
  }

  async getUserEvents(
    userId: User['id'],
    limit: number,
    type: 'all' | 'seen' | 'unseen',
    nextKey?: string,
  ): Promise<PaginatedData<ProfileEvent>> {
    const key = super.parseNextKey(nextKey);

    const seenAt = {
      all: undefined,
      seen: { not: null },
      unseen: null,
    };

    const profileEvents = await this.prismaService.profile_event.findMany({
      where: {
        user_to_id: userId,
        seen_at: seenAt[type],
        created_at: key ? { lte: new Date(key) } : undefined,
      },
      select: selectProfileEvent,
      take: limit + 1,
      orderBy: { created_at: 'desc' },
    });

    return super.getPaginatedData(profileEvents, limit, 'created_at');
  }

  async getAmountOfUnseenEvents(userId: User['id']): Promise<number> {
    return this.prismaService.profile_event.count({
      where: { seen_at: null, user_to_id: userId },
    });
  }

  async getEvent(eventId: ProfileEvent['id']): Promise<ProfileEvent | null> {
    return this.prismaService.profile_event.findUnique({
      where: {
        id: eventId,
        deleted_at: null,
      },
      select: selectProfileEvent,
    });
  }
}
