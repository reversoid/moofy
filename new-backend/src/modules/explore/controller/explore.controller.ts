import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { IExploreController } from './explore.controller.interface';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { getPublicCollectionsResponseSchema } from './responses/get-public-collections.response';
import { getTopProfilesResponseSchema } from './responses/get-top-profiles.response';
import { searchProfilesResponseSchema } from './responses/search-profiles.response';
import { User } from 'src/modules/user/models/user';
import { JwtAuthGuard } from 'src/modules/auth/passport/jwt-auth.guard';
import { ExploreService } from '../explore.service';
import { ApiTags } from '@nestjs/swagger';
import { ParseStringPipe } from 'src/shared/parse-string-pipe';
import { OptionalJwtAuthGuard } from 'src/modules/auth/passport/jwt-optional-auth.guard';

@Controller('explore')
@ApiTags('Explore')
export class ExploreController implements IExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  @Get('collections')
  @HttpResponse(getPublicCollectionsResponseSchema)
  @UseGuards(OptionalJwtAuthGuard)
  async getPublicCollections(
    @AuthUser() user: User | null,
    @Query('search', new ParseStringPipe()) search: string | null = null,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    return this.exploreService.getPublicCollections(
      search,
      limit,
      user?.id ?? null,
    );
  }

  @Get('top-profiles')
  @HttpResponse(getTopProfilesResponseSchema)
  @UseGuards(JwtAuthGuard)
  async getTopProfiles(
    @AuthUser() user: User,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    return this.exploreService.getTopProfiles(limit, user.id);
  }

  @Get('profiles')
  @UseGuards(JwtAuthGuard)
  @HttpResponse(searchProfilesResponseSchema)
  async searchProfiles(
    @AuthUser() user: User,
    @Query('search') username: string = '',
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    return this.exploreService.getProfiles(username, limit, user.id);
  }
}
