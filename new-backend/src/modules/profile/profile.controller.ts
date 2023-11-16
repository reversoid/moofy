import { Controller, Get } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
  @Get(':id/list-updates')
  async getListUpdates() {}

  @Get(':id/list-updates/amount')
  async getAmountOfUpdates() {}
}
