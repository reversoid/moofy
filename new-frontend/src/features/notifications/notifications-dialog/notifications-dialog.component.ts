import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { finalize, takeUntil } from 'rxjs';
import { NotificationComponent } from '../../../entities/notification/notification.component';
import { PaginatedData, ProfileDirectNotification } from '../../../shared/types';
import { NotificationsService } from '../utils/notifications.service';
import {
  NotificationsShownSelectComponent,
  OptionId,
} from './notifications-shown-select/notifications-shown-select.component';

@Component({
  selector: 'app-notifications-dialog',
  standalone: true,
  imports: [NgFor, NotificationComponent, TuiButtonModule, NgIf, NotificationsShownSelectComponent],
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

  private notifications = signal<PaginatedData<ProfileDirectNotification> | null>(null);

  loading = signal(false);

  notificationsItems = computed(() => this.notifications()?.items);

  loadKey = computed(() => this.notifications()?.nextKey);

  emptyNotifications = computed(() => this.notifications()?.items.length === 0);

  firstLoading = computed(() => this.notifications() === null);

  selectedOption: OptionId = 'UNREAD';

  changeSelectedOption(optionId: OptionId) {
    this.selectedOption = optionId;
  }

  ngOnInit(): void {
    this.loadNotifications();
    this.notifications.set(null);
  }

  loadNotifications(nextKey?: string) {
    this.loading.set(true);

    const result =
      this.selectedOption === 'ALL'
        ? this.notificationsServce.getAllNotifications(nextKey)
        : this.notificationsServce.getUnseenNotifications(nextKey);

    result
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
