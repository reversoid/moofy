import { Controller, Get } from '@nestjs/common';

@Controller('explore')
export class ExploreController {
  @Get('public-collections')
  async getPublicCollections() {}
}
