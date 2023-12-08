import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { IExploreController } from './explore.controller.interface';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { getPublicCollectionsResponseSchema } from './responses/get-public-collections.response';
import { getTopProfilesResponseSchema } from './responses/get-top-profiles.response';
import { searchProfilesResponseSchema } from './responses/search-profiles.response';
import { User } from 'src/modules/user/models/user';
import { JwtAuthGuard } from 'src/modules/auth/passport/jwt-auth.guard';
import { ExploreService } from '../explore.service';

@Controller('explore')
export class ExploreController implements IExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  @Get('collections')
  @HttpResponse(getPublicCollectionsResponseSchema)
  async getPublicCollections(@Query('search') username: string = '') {
    return this.exploreService.getPublicCollections(username);
  }

  @Get('top-profiles')
  @HttpResponse(getTopProfilesResponseSchema)
  @UseGuards(JwtAuthGuard)
  async getTopProfiles(@AuthUser() user: User) {
    return this.exploreService.getTopProfiles(user.id);
  }

  @Get('profiles')
  @HttpResponse(searchProfilesResponseSchema)
  async searchProfiles(@Query('search') username: string) {
    return this.exploreService.getProfiles(username);
  }
}
