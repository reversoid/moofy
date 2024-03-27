import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ProfileDirectNotification } from '../../../shared/types';
import { ENVIRONMENT } from '../../../environments/provider';
import { IEnvironment } from '../../../environments/interface';
import { AuthService } from '../../auth/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ProfileSocketService {
  constructor(
    @Inject(ENVIRONMENT) readonly env: IEnvironment,
    readonly authService: AuthService,
    @Inject(PLATFORM_ID) readonly platformId: Object,
  ) {
    if (isPlatformBrowser(platformId)) {
      this.socket = new Socket({
        url: env.apiUrl,
        options: { query: { token: authService.accessToken } },
      });
    }
  }

  socket: Socket | null = null;

  getNewNotifications() {
    return this.socket?.fromEvent<ProfileDirectNotification>('notification:direct');
  }

  getSeenNotificationsEvents() {
    return this.socket?.fromEvent<{ notificationId: ProfileDirectNotification['id'] }>(
      'notification:seen',
    );
  }

  getCounterNotificationsEvents() {
    return this.socket?.fromEvent<{ notificationId: ProfileDirectNotification['id'] }>(
      'notification:counter',
    );
  }

  disconnectSocket() {
    this.socket?.disconnect();
  }
}
