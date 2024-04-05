import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CollectionWithInfo, PaginatedData, Profile, ShortProfile } from '../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class ExploreService {
  constructor(private readonly http: HttpClient) {}

  searchCollections(search?: string) {
    const params = new HttpParams();
    if (search) {
      params.append('search', search);
    }

    params.append('limit', 20);

    return this.http.get<PaginatedData<CollectionWithInfo>>('explore/collections', {
      params,
    });
  }

  searchProfiles(search?: string) {
    const params = new HttpParams();
    if (search) {
      params.append('search', search);
    }

    params.append('limit', 20);

    return this.http.get<PaginatedData<ShortProfile>>('explore/profiles', {
      params,
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
