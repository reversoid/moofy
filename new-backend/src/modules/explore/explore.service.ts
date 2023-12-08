import { Injectable } from '@nestjs/common';
import { User } from '../user/models/user';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { ShortProfile } from '../profile/models/short-profile';
import { Collection } from '../collection/models/collection';

@Injectable()
export class ExploreService {
  async getProfiles(username?: string): Promise<PaginatedData<ShortProfile>> {}

  async getPublicCollections(
    username?: string,
  ): Promise<PaginatedData<Collection>> {}

  async getTopProfiles(
    userId?: User['id'],
  ): Promise<PaginatedData<ShortProfile>> {}
}
