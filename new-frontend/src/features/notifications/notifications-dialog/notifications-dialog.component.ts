import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { finalize, takeUntil } from 'rxjs';
import { NotificationComponent } from '../../../entities/notification/notification.component';
import { PaginatedData, ProfileDirectNotification } from '../../../shared/types';
import { NotificationsService } from '../utils/notifications.service';

@Component({
  selector: 'app-notifications-dialog',
  standalone: true,
  imports: [NgFor, NotificationComponent, TuiButtonModule, NgIf],
  templateUrl: './notifications-dialog.component.html',
  styleUrl: './notifications-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, TuiLoaderModule],
})
export class NotificationsDialogComponent implements OnInit {
  constructor(
    private readonly notificationsServce: NotificationsService,
    private readonly destroy$: TuiDestroyService,
  ) {}

  mock = new Array(100).fill(null);

  private notifications = signal<PaginatedData<ProfileDirectNotification> | null>(null);

  notificationsItems = computed(() => this.notifications()?.items);

  loadKey = computed(() => this.notifications()?.nextKey);

  loading = signal(false);

  emptyNotifications = computed(() => this.notifications()?.items.length === 0);

  firstLoading = computed(() => this.notifications() === null);

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(nextKey?: string) {
    this.loading.set(true);

    this.notificationsServce
      .getUnseenNotifications(nextKey)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.destroy$),
      )
      .subscribe((data) => {
        if (!this.notifications()) {
          return this.notifications.set(data);
        }

        this.notifications.update((n) => ({
          items: [...n!.items, ...data.items],
          nextKey: data.nextKey,
        }));
      });
  }
}
