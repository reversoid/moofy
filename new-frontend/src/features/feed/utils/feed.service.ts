import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CollectionWithInfo, PaginatedData } from '../../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  constructor(private readonly http: HttpClient) {}

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
