import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateProfileEventDto } from '../dto/create-profile-event.dto';
import { RemoveProfileEventDto } from '../dto/remove-profile-event.dto';
import { ProfileEvent, selectProfileEvent } from '../models/profile-event';

@Injectable()
export class ProfileEventRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createEvent({
    eventType,
    fromUserId,
    targetId,
    toUserId,
  }: CreateProfileEventDto) {
    return this.prismaService.profile_event.create({
      data: {
        type: eventType,
        user_to_id: toUserId,
        created_at: new Date(),
        target_id: targetId,
        user_from_id: fromUserId,
      },
      select: selectProfileEvent,
    });
  }

  async removeEvent({
    eventType,
    fromUserId,
    targetId,
    toUserId,
  }: RemoveProfileEventDto) {
    const events = await this.prismaService.profile_event.findMany({
      where: {
        type: eventType,
        user_from_id: fromUserId,
        user_to_id: toUserId,
        target_id: targetId,
        deleted_at: null,
      },
      select: selectProfileEvent,
    });

    await this.prismaService.profile_event.updateMany({
      data: { deleted_at: new Date() },
      where: {
        id: { in: events.map((e) => e.id) },
      },
    });

    return events;
  }

  async markEventAsSeen(eventId: ProfileEvent['id']) {
    const event = await this.prismaService.profile_event.findUnique({
      where: {
        id: eventId,
        deleted_at: null,
      },
    });

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
  }
}
