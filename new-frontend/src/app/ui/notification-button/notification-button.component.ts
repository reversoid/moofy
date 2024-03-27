import { ChangeDetectionStrategy, Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';
import { ProfileNotificationsDialogComponent } from '../../../features/profile-notifications/profile-notifications-dialog/profile-notifications-dialog.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiBadgeModule } from '@taiga-ui/kit';
import { SocketIoModule } from 'ngx-socket-io';
import { ProfileSocketService } from '../../../features/profile-notifications/utils/profile-socket.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { selectUnseenNotificationsAmount } from '../../../entities/profile-notifications/model/selectors';
import { AsyncPipe, NgIf } from '@angular/common';
import { NotificationsService } from '../../../features/profile-notifications';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs';
import { profileNotificationsActions } from '../../../entities/profile-notifications/model/actions';

@Pipe({ name: 'formatNotificationsAmount', standalone: true })
export class FormatNotificationsAmountPipe implements PipeTransform {
  transform(value: number | null): string {
    if (!value) {
      return '';
    }

    if (value > 9) {
      return '9+';
    }
    return String(value);
  }
}

@Component({
  selector: 'app-notification-button',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiBadgeModule,
    SocketIoModule,
    AsyncPipe,
    NgIf,
    FormatNotificationsAmountPipe,
  ],
  templateUrl: './notification-button.component.html',
  styleUrl: './notification-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class NotificationButtonComponent implements OnInit {
  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly store: Store<AppState>,
    private readonly profileSocketService: ProfileSocketService,
    private readonly notificationsService: NotificationsService,
    private readonly destroy$: TuiDestroyService,
  ) {}

  ngOnInit(): void {
    this.initProfileNotifications();
  }

  openNotifications() {
    this.dialogService
      .open(new PolymorpheusComponent(ProfileNotificationsDialogComponent), {
        label: 'Уведомления',
        size: 'l',
      })
      .subscribe();
  }

  unseenNotificationsAmount$ = this.store.select(selectUnseenNotificationsAmount);

  private initProfileNotifications() {
    this.notificationsService
      .getUnseenNotificationsAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ amount }) => {
        this.store.dispatch(profileNotificationsActions.setUnseenAmount({ amount }));
      });

    this.profileSocketService
      .getNewNotifications()
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(profileNotificationsActions.incrementUnseenAmount());
      });

    this.profileSocketService
      .getCounterNotificationsEvents()
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(profileNotificationsActions.decrementUnseenAmount());
      });

    this.profileSocketService
      .getSeenNotificationsEvents()
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(profileNotificationsActions.decrementUnseenAmount());
      });
  }
}
