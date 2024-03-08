import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CollectionWithInfo,
  FullCollection,
  PaginatedData,
  Profile,
  ShortProfile,
  User,
} from '../../shared/types';
import { Observable } from 'rxjs';
import { CreatePersonalCollectionProps, EditProfileDto } from './types';
import { UploadImageService } from '../../shared/utils/upload-image/upload-image.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private readonly http: HttpClient,
    private readonly uploadImageService: UploadImageService,
  ) {}

  getProfile(id: User['id']): Observable<Profile> {
    return this.http.get<Profile>(`profile${id}`);
  }

  editProfile(dto: EditProfileDto): Observable<void> {
    return this.http.patch<void>(`profile`, {
      username: dto.username,
      description: dto.description,
      imageUrl: dto.imageUrl,
    });
  }

  uploadProfileImage(file: File): Observable<{ link: string }> {
    return this.uploadImageService.uploadImage('profile/image-upload', file);
  }

  follow(id: User['id']): Observable<void> {
    return this.http.get<void>(`profile/${id}`);
  }

  unfollow(id: User['id']): Observable<void> {
    return this.http.get<void>(`profile/${id}`);
  }

  getFollowers(id: User['id']): Observable<PaginatedData<ShortProfile>> {
    return this.http.get<PaginatedData<ShortProfile>>(`profile/${id}/followers`);
  }

  getFollowees(id: User['id']): Observable<PaginatedData<ShortProfile>> {
    return this.http.get<PaginatedData<ShortProfile>>(`profile/${id}/followees`);
  }

  getPersonalCollection(id: User['id']): Observable<FullCollection> {
    return this.http.get<FullCollection>(`profile/${id}/collections/personal`);
  }

  createPersonalCollection(dto: CreatePersonalCollectionProps): Observable<CollectionWithInfo> {
    return this.http.put<CollectionWithInfo>(`profile/collections/personal`, dto);
  }
}
