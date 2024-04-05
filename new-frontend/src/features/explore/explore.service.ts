import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CollectionWithInfo, PaginatedData, ShortProfile } from '../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class ExploreService {
  constructor(private readonly http: HttpClient) {}

  searchCollections(search?: string) {
    return this.http.get<PaginatedData<CollectionWithInfo>>('explore/collections', {
      params: {
        limit: 20,
        search: search ?? '',
      },
    });
  }

  searchProfiles(search?: string) {
    return this.http.get<PaginatedData<ShortProfile>>('explore/profiles', {
      params: {
        search: search ?? '',
        limit: 20,
      },
    });
  }

  getTopProfiles() {
    return this.http.get<PaginatedData<ShortProfile>>('explore/top-profiles', {
      params: { limit: 20 },
    });
  }

  getUnseenAmount() {
    return this.http.get<{ amount: number }>('explore/unseen/amount');
  }

  getUnseenCollections(nextKey?: string) {
    return this.http.get<PaginatedData<CollectionWithInfo>>('explore/unseen', {
      params: nextKey ? { nextKey } : undefined,
    });
  }

  getLatestUpdatedCollections(nextKey?: string) {
    return this.http.get<PaginatedData<CollectionWithInfo>>('explore/latest-updated', {
      params: nextKey ? { nextKey } : undefined,
    });
  }
}
