import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { EMPTY, catchError, debounceTime, finalize, from, map, mergeMap, takeUntil } from 'rxjs';
import { PaginatedData, ProfileDirectNotification } from '../../../shared/types';
import { NotificationsService } from '../utils/notifications.service';
import {
  NotificationsShownSelectComponent,
  OptionId,
} from './notifications-shown-select/notifications-shown-select.component';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { NotificationsViewService } from '../utils/notifications-view.service';
import { NotificationComponent } from '../../../entities/profile-notifications';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-profile-notifications-dialog',
  standalone: true,
  imports: [
    NgFor,
    NotificationComponent,
    TuiButtonModule,
    NgIf,
    NotificationsShownSelectComponent,
    IntersectionObserverModule,
    TuiIslandModule,
  ],
  templateUrl: './profile-notifications-dialog.component.html',
  styleUrl: './profile-notifications-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, TuiLoaderModule, NotificationsViewService],
})
export class ProfileNotificationsDialogComponent implements OnInit {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly destroy$: TuiDestroyService,
    private readonly notificationsViewService: NotificationsViewService,
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

    this.loadNotifications(this.loadKey());
    this.notifications.set(null);
  }

  ngOnInit(): void {
    this.loadNotifications();
    this.initializeViewOfNotifications();
  }

  handleObservedNotification(
    observerEntries: IntersectionObserverEntry[],
    id: ProfileDirectNotification['id'],
  ) {
    const isVisible = observerEntries.at(-1)?.isIntersecting;

    if (isVisible) {
      this.notificationsViewService.addIdToViewPool(id);
    } else {
      this.notificationsViewService.removeIdFromViewPool(id);
    }
  }

  loadNotifications(nextKey?: string | null) {
    this.loading.set(true);

    const result =
      this.selectedOption === 'ALL'
        ? this.notificationsService.getAllNotifications(nextKey)
        : this.notificationsService.getUnseenNotifications(nextKey);

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

  private initializeViewOfNotifications() {
    this.notificationsViewService.idsToMarkAsSeen$
      .pipe(
        debounceTime(100),
        map((idsSet) => Array.from(idsSet)),
        mergeMap((ids) => from(ids)),
        mergeMap((id) => {
          return this.notificationsService.markNotificationAsSeen(id).pipe(catchError(() => EMPTY));
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }
}
