import { Controller, Delete, Get, Patch, Put } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
  @Get(':id/list-updates')
  async getListUpdates() {}

  @Get(':id/list-updates/amount')
  async getAmountOfUpdates() {}

  @Get(':id/collections')
  async getCollections() {}

  @Patch(':id')
  async editProfile() {}

  @Put(':id/followers')
  async followUser() {}

  @Delete(':id/followers')
  async unfollowUser() {}

  @Get(':id/followers')
  async getFollowers() {}

  @Get(':id/followees')
  async getFollowees() {}
}
