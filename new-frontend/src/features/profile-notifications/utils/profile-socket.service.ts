import { Inject, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ProfileDirectNotification } from '../../../shared/types';
import { ENVIRONMENT } from '../../../environments/provider';
import { IEnvironment } from '../../../environments/interface';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ProfileSocketService extends Socket {
  constructor(
    @Inject(ENVIRONMENT) readonly env: IEnvironment,
    readonly authService: AuthService,
  ) {
    super({
      url: env.apiUrl,
      options: { query: { token: authService.accessToken } },
    });
  }

  getNewNotifications() {
    return this.fromEvent<ProfileDirectNotification>('notification:direct');
  }

  getSeenNotificationsEvents() {
    return this.fromEvent<{ notificationId: ProfileDirectNotification['id'] }>('notification:seen');
  }

  getCounterNotificationsEvents() {
    return this.fromEvent<{ notificationId: ProfileDirectNotification['id'] }>(
      'notification:counter',
    );
  }

  disconnectSocket() {
    this.disconnect();
  }
}
