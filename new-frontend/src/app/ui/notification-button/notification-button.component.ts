import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';
import { NotificationsDialogComponent } from '../../../features/notifications/notifications-dialog/notifications-dialog.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-notification-button',
  standalone: true,
  imports: [TuiButtonModule],
  templateUrl: './notification-button.component.html',
  styleUrl: './notification-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationButtonComponent {
  constructor(private readonly dialogService: TuiDialogService) {}

  openNotifications() {
    this.dialogService
      .open(new PolymorpheusComponent(NotificationsDialogComponent), {
        label: 'Уведомления',
        size: 'l',
      })
      .subscribe();
  }
}
