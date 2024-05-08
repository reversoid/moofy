import { Injectable } from '@angular/core';
import { CreatePersonalCollectionProps } from './types';
import { HttpClient } from '@angular/common/http';
import { CollectionWithInfo, Review } from '../../shared/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonalCollectionService {
  constructor(private readonly http: HttpClient) {}

  createPersonalCollection(dto: CreatePersonalCollectionProps): Observable<CollectionWithInfo> {
    return this.http.put<CollectionWithInfo>(`profile/collections/personal`, dto);
  }

  getPersonalCollectionConficts(): Observable<{ conflicts: Review[] }> {
    return this.http.get<{ conflicts: Review[] }>(`profile/collections/personal/conflicts`);
  }

  resolvePersonalCollectionConficts(reviewsIdsToPick: Array<Review['id']>): Observable<void> {
    return this.http.patch<void>(`profile/collections/personal/conflicts`, {
      reviewsIds: reviewsIdsToPick,
    });
  }
}
