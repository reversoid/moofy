import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/passport/jwt-auth.guard';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { User } from '../../user/models/user';
import { PaginatedQueryDto } from 'src/shared/utils/pagination/paginated-query.dto';
import { ProfileEventsService } from '../profile-events.service';
import { UserCanAccessEventGuard } from '../guards/user-can-access-guard';
import { IProfileNotificationsController } from './interface';

@Controller('profile-events')
export class ProfileNotificationsController
  implements IProfileNotificationsController
{
  constructor(private readonly eventService: ProfileEventsService) {}

  @Get('unseen')
  @UseGuards(JwtAuthGuard)
  async getUnreadEvents(
    @AuthUser() user: User,
    @Query() { limit, nextKey }: PaginatedQueryDto,
  ) {
    return this.eventService.getEventsForUser(
      user.id,
      limit ?? 20,
      'unseen',
      nextKey,
    );
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllEvents(
    @AuthUser() user: User,
    @Query() { limit, nextKey }: PaginatedQueryDto,
  ) {
    return this.eventService.getEventsForUser(
      user.id,
      limit ?? 20,
      'all',
      nextKey,
    );
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

    return { amount };
  }

  @Patch('unseen/:id')
  @UseGuards(JwtAuthGuard, UserCanAccessEventGuard)
  async markEventAsSeen(@Param('id', ParseUUIDPipe) eventId: string) {
    await this.eventService.markEventAsSeen(eventId);
  }
}
