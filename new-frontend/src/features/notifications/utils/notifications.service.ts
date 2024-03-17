import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedData, ProfileDirectNotification } from '../../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private readonly http: HttpClient) {}

  getAllNotifications() {
    return this.http.get<PaginatedData<ProfileDirectNotification>>('profile-notifications/all');
  }

  getUnseenNotifications() {
    return this.http.get<PaginatedData<ProfileDirectNotification>>('profile-notifications/unseen');
  }

  getUnseenNotificationsAmount() {
    return this.http.get<{ amount: number }>('profile-notifications/unseen/amount');
  }

  markAllNotificationsAsSeen() {
    return this.http.patch<void>('profile-notifications/unseen', {});
  }
}
