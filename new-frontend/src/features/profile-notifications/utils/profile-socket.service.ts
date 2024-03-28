import { Inject, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ProfileDirectNotification } from '../../../shared/types';
import { ENVIRONMENT } from '../../../environments/provider';
import { IEnvironment } from '../../../environments/interface';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ProfileSocketService {
  constructor(
    @Inject(ENVIRONMENT) private readonly env: IEnvironment,
    private readonly authService: AuthService,
  ) {}

  initSocket() {
    this.socket = new Socket({
      url: this.env.apiUrl,
      options: { query: { token: this.authService.accessToken } },
    });
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
