import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateProfileEventDto } from '../dto/create-profile-event.dto';
import { RemoveProfileEventDto } from '../dto/remove-profile-event.dto';
import { MakeEventSeenDto } from '../dto/make-event-seen.dto';

@Injectable()
export class ProfileEventRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createEvent({
    eventType,
    fromUserId,
    targetId,
    toUserId,
  }: CreateProfileEventDto) {
    await this.prismaService.profile_event.create({
      data: {
        type: eventType,
        user_to_id: toUserId,
        created_at: new Date(),
        target_id: targetId,
        user_from_id: fromUserId,
      },
    });
  }

  async removeEvent({
    eventType,
    fromUserId,
    targetId,
    toUserId,
  }: RemoveProfileEventDto) {
    await this.prismaService.profile_event.updateMany({
      where: {
        type: eventType,
        user_from_id: fromUserId,
        user_to_id: toUserId,
        target_id: targetId,
        deleted_at: null,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async markEventAsSeen({ eventId }: MakeEventSeenDto) {
    await this.prismaService.profile_event.update({
      where: {
        id: eventId,
      },
      data: {
        seen_at: new Date(),
      },
    });
  }
}
