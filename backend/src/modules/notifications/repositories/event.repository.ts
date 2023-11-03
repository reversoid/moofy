import { DataSource, IsNull } from 'typeorm';
import { Event } from '../entities/event.entity';
import { Injectable } from '@nestjs/common';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';

@Injectable()
export class EventRepository extends PaginatedRepository<Event> {
  constructor(dataSource: DataSource) {
    super(Event, dataSource.createEntityManager());
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
}
