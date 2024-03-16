import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FullCollection, PaginatedData, Profile, ShortProfile, User } from '../../shared/types';
import { UploadImageService } from '../../shared/utils/upload-image/upload-image.service';
import { EditProfileDto } from './types';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private readonly http: HttpClient,
    private readonly uploadImageService: UploadImageService,
  ) {}

  getProfile(id: User['id']): Observable<Profile> {
    return this.http.get<Profile>(`profiles/${id}`, { params: { limit: 20 } });
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
    return this.http.put<void>(`profiles/${id}/followers`, {});
  }

  unfollow(id: User['id']): Observable<void> {
    return this.http.delete<void>(`profiles/${id}/followers`);
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
}
