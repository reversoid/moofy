import { Injectable } from '@nestjs/common';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { UserEventDto } from './utils/types';
import { UserEvent, selectUserEvent } from './models/user-event';

@Injectable()
export class EventRepository extends PaginatedRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async createEvent(dto: UserEventDto): Promise<UserEvent> {
    return this.prismaService.event.create({
      data: { type: dto.type, targetId: dto.targetId },
      select: selectUserEvent,
    });
  }

  async removeEvent(dto: UserEventDto): Promise<UserEvent | null> {
    const event = await this.prismaService.event.findFirst({
      where: { type: dto.type, targetId: dto.targetId, deletedAt: null },
      select: selectUserEvent,
    });

    if (!event) {
      return null;
    }

    const deletedDate = new Date();
    await this.prismaService.event.update({
      where: { id: event.id },
      data: { deletedAt: deletedDate },
    });

    return { ...event, deletedAt: deletedDate };
  }
}
