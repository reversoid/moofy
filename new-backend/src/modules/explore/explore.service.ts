import { Injectable } from '@nestjs/common';
import { User } from '../user/models/user';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { ShortProfile } from '../profile/models/short-profile';
import { Collection } from '../collection/models/collection';
import { ProfileService } from '../profile/profile.service';
import { CollectionService } from '../collection/collection.service';

@Injectable()
export class ExploreService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly collectionService: CollectionService,
  ) {}

  async getProfiles(
    search: string,
    limit: number,
    forUserId: User['id'],
  ): Promise<PaginatedData<ShortProfile>> {
    return this.profileService.searchProfiles(search, limit, forUserId);
  }

  async getPublicCollections(
    search: string | null,
    limit: number,
  ): Promise<PaginatedData<Collection>> {
    if (!search) {
      return this.collectionService.getTopPublicCollections(limit);
    }

    return this.collectionService.searchPublicCollections(search, limit);
  }

  async getTopProfiles(
    limit: number,
    forUserId?: User['id'],
  ): Promise<PaginatedData<ShortProfile>> {
    return this.profileService.getTopProfiles(limit, forUserId);
  }
}
