import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationComponent } from '../../../entities/notification/notification.component';

@Component({
  selector: 'app-notifications-dialog',
  standalone: true,
  imports: [NgFor, NotificationComponent],
  templateUrl: './notifications-dialog.component.html',
  styleUrl: './notifications-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsDialogComponent {
  mock = new Array(100).fill(null);
}
