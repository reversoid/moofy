import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { NotificationComponent } from '../../../entities/notification/notification.component';
import { NotificationsService } from '../utils/notifications.service';
import { PaginatedData, ProfileDirectNotification } from '../../../shared/types';

@Component({
  selector: 'app-notifications-dialog',
  standalone: true,
  imports: [NgFor, NotificationComponent],
  templateUrl: './notifications-dialog.component.html',
  styleUrl: './notifications-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsDialogComponent implements OnInit {
  constructor(private readonly notificationsServce: NotificationsService) {}

  mock = new Array(100).fill(null);

  notifications = signal<PaginatedData<ProfileDirectNotification> | null>(null);

  ngOnInit(): void {
    this.notificationsServce.getUnseenNotifications();
  }
}
