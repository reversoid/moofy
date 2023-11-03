import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { User } from '../user/entities/user.entity';
import { PaginationQueryDTO } from 'src/shared/pagination/pagination.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('unseen')
  @UseGuards(JwtAuthGuard)
  async getUnreadEvents(
    @Request() { user }: { user: User },
    @Query() { limit, lowerBound }: PaginationQueryDTO,
  ) {
    return this.notificationsService.getUnseenEventsForUser(
      user.id,
      limit,
      lowerBound,
    );
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllEvents(
    @Request() { user }: { user: User },
    @Query() { limit, lowerBound }: PaginationQueryDTO,
  ) {
    return this.notificationsService.getAllEventsForUser(
      user.id,
      limit,
      lowerBound,
    );
  }

  @Patch('unseen/all')
  @UseGuards(JwtAuthGuard)
  async markAllEventsAsSeen(@Request() { user }: { user: User }) {
    await this.notificationsService.markAllEventsSeen(user.id);
  }

  @Get('unseen-amount')
  @UseGuards(JwtAuthGuard)
  async getUnseenAmount(@Request() { user }: { user: User }) {
    const amount = await this.notificationsService.getAmountOfUnseenEvents(
      user.id,
    );

    return { unseen: amount };
  }

  @Patch('unseen/:id')
  @UseGuards(JwtAuthGuard)
  async markEventAsSeen(
    @Request() { user }: { user: User },
    @Param('id') eventId: string,
  ) {
    return this.notificationsService.markEventAsSeen(user.id, eventId);
  }
}
