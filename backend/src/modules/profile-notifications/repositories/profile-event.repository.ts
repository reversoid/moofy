import { DataSource, IsNull } from 'typeorm';
import { ProfileEvent } from '../entities/profile-event.entity';
import { Injectable } from '@nestjs/common';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';
import { SendProfileEventDTO } from 'src/modules/event/utils/types';

@Injectable()
export class ProfileEventRepository extends PaginatedRepository<ProfileEvent> {
  constructor(dataSource: DataSource) {
    super(ProfileEvent, dataSource.createEntityManager());
  }

  async getUnreadEvents(userId: number, limit: number, lowerBound?: Date) {
    const events = await super.find({
      select: {
        id: true,
        user_to_id: true,
        user_from_id: true,
        type: true,
        seen_at: true,
        target_id: true,
        created_at: true,
      },
      where: {
        seen_at: IsNull(),
        user_to_id: userId,
        created_at: super.getCompareOperator(lowerBound),
      },
      order: { created_at: 'DESC' },
      take: limit + 1,
    });
    return this.processPagination(events, limit, 'created_at');
  }

  async getAllEvents(userId: number, limit: number, lowerBound?: Date) {
    const events = await super.find({
      select: {
        id: true,
        user_to_id: true,
        user_from_id: true,
        type: true,
        seen_at: true,
        target_id: true,
        created_at: true,
      },
      where: {
        user_to_id: userId,
        created_at: super.getCompareOperator(lowerBound),
      },
      order: { created_at: 'DESC' },
      take: limit + 1,
    });
    return this.processPagination(events, limit, 'created_at');
  }

  async markEventAsSeen(userId: number, eventId: string) {
    const event = await this.findOneBy({ id: eventId, user_to_id: userId });
    if (event) {
      event.seen_at = new Date();
      await this.save(event);
    }
  }

  async getAmountOfUnseenEvents(userId: number) {
    return this.count({ where: { user_to_id: userId, seen_at: IsNull() } });
  }

  async removeEvent(eventId: string) {
    await this.softRemove({ id: eventId });
  }

  async markAllEventsSeen(userId: number) {
    const events = await this.find({
      where: { seen_at: IsNull(), user_to_id: userId },
      select: { id: true, seen_at: true },
    });

    for (const event of events) {
      event.seen_at = new Date();
    }

    await this.save(events);
  }

  async createEvent(dto: SendProfileEventDTO) {
    if (dto.type !== 'direct') {
      throw new Error('Only direct type is allowed on create event');
    }
    const event: ProfileEvent = await this.save({
      user_from_id: dto.fromUserId,
      user_to_id: dto.toUserId,
      target_id: dto.targetId,
      type: dto.eventType,
    });
    return event;
  }

  async removeEvents(dto: SendProfileEventDTO) {
    if (dto.type !== 'counter') {
      throw new Error('Only counter type is allowed on remove events');
    }
    const events = await this.findBy({
      target_id: dto.targetId,
      user_from_id: dto.fromUserId,
      user_to_id: dto.toUserId,
      type: dto.eventType,
    });
    await this.softRemove(events);
    return events.map((e) => e.id);
  }
}
