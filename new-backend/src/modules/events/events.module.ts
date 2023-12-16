import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventRepository } from './event.repository';
import { PrismaService } from 'src/shared/utils/prisma-service';

@Module({
  providers: [EventsService, EventRepository, PrismaService],
  exports: [EventsService],
})
export class EventsModule {}
