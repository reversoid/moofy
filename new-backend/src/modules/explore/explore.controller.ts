import { Controller, Get } from '@nestjs/common';

@Controller('explore')
export class ExploreController {
  @Get('collections')
  async getPublicCollections() {}

  @Get('top-profiles')
  async getTopProfiles() {}

  @Get('profiles')
  async searchProfiles() {}
}
