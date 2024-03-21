import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';
import { ProfileNotificationsDialogComponent } from '../../../features/profile-notifications/profile-notifications-dialog/profile-notifications-dialog.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiBadgeModule } from '@taiga-ui/kit';
import { SocketIoModule } from 'ngx-socket-io';

@Component({
  selector: 'app-notification-button',
  standalone: true,
  imports: [TuiButtonModule, TuiBadgeModule, SocketIoModule],
  templateUrl: './notification-button.component.html',
  styleUrl: './notification-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationButtonComponent {
  constructor(private readonly dialogService: TuiDialogService) {}

  openNotifications() {
    this.dialogService
      .open(new PolymorpheusComponent(ProfileNotificationsDialogComponent), {
        label: 'Уведомления',
        size: 'l',
      })
      .subscribe();
  }
}
