import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { User } from '../user/models/user';
import { PaginatedQueryDto } from 'src/shared/utils/pagination/paginated-query.dto';
import { ProfileEventsService } from './profile-events.service';
import { UserCanAccessEventGuard } from './guards/user-can-access-guard';

@Controller('profile-events')
export class ProfileNotificationsController {
  constructor(private readonly eventService: ProfileEventsService) {}

  @Get('unseen')
  @UseGuards(JwtAuthGuard)
  async getUnreadEvents(
    @AuthUser() user: User,
    @Query() { limit, nextKey }: PaginatedQueryDto,
  ) {
    return this.eventService.getUnseenEventsForUser(user.id, limit, nextKey);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllEvents(
    @AuthUser() user: User,
    @Query() { limit, nextKey }: PaginatedQueryDto,
  ) {
    return this.eventService.getAllEventsForUser(user.id, limit, nextKey);
  }

  @Patch('unseen/all')
  @UseGuards(JwtAuthGuard)
  async markAllEventsAsSeen(@AuthUser() user: User) {
    return this.eventService.markAllEventsSeen(user.id);
  }

  @Get('unseen/amount')
  @UseGuards(JwtAuthGuard)
  async getUnseenAmount(@AuthUser() user: User) {
    const amount = await this.eventService.getAmountOfUnseenEvents(user.id);

    return { unseen: amount };
  }

  @Patch('unseen/:id')
  @UseGuards(JwtAuthGuard, UserCanAccessEventGuard)
  async markEventAsSeen(@Param('id', ParseUUIDPipe) eventId: string) {
    return this.eventService.markEventAsSeen(eventId);
  }
}
