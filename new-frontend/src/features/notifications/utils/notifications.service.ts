import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedData, ProfileDirectNotification } from '../../../shared/types';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private readonly http: HttpClient) {}

  getAllNotifications(nextKey?: string | null) {
    return this.http.get<PaginatedData<ProfileDirectNotification>>('profile-notifications/all', {
      params: nextKey ? { nextKey } : undefined,
    });
  }

  getUnseenNotifications(nextKey?: string | null) {
    return this.http.get<PaginatedData<ProfileDirectNotification>>('profile-notifications/unseen', {
      params: nextKey ? { nextKey } : undefined,
    });
  }

  getUnseenNotificationsAmount() {
    return this.http.get<{ amount: number }>('profile-notifications/unseen/amount');
  }

  markNotificationAsSeen(id: string) {
    return this.http.patch<void>(`profile-notifications/unseen/${id}`, {});
  }

  markAllNotificationsAsSeen() {
    return this.http.patch<void>('profile-notifications/unseen/all', {});
  }
}
